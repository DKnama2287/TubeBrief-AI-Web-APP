import { NextRequest, NextResponse } from "next/server";
import { authOptions, CustomSession } from "../auth/[...nextauth]/options";
import { get } from "http";
import { getServerSession } from "next-auth";
import { getUserCoins } from "@/actions/fetchActions";
import prisma from "@/lib/db.config";
import { coinsSpend, minusCoins, updateSummary } from "@/actions/commonActions";
import {Document} from "@langchain/core/documents"
import { TokenTextSplitter } from "@langchain/textsplitters";
import { summaryTemplate } from "@/lib/prompts";
import { PromptTemplate } from "@langchain/core/prompts";
import { gptModal } from "@/lib/langchain";
import { getYouTubeTranscript } from "@/lib/youtube";

interface SummarizePayload {
  url: string;
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const session: CustomSession | null = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    let body: SummarizePayload;
    try {
      body = await request.json();
    } catch (error) {
      console.error("❌ Invalid JSON in request body");
      return NextResponse.json({
        error: "Invalid request. Please provide valid JSON data."
      }, { status: 400 });
    }

    if (!body || !body.url || !body.id) {
      return NextResponse.json({
        error: "URL and ID are required"
      }, { status: 400 });
    }

    console.log("🎯 Summarize request:", { url: body.url, id: body.id, user: session?.user?.id });

    // Check if this summary already exists with a response
    const existingSummary = await prisma.summary.findFirst({
      select: {
        response: true,
      },
      where: {
        id: body.id,
      },
    });

    // If summary already has response, return it WITHOUT deducting coins
    if (existingSummary?.response) {
      console.log("✅ Returning existing summary (no coins deducted)");
      return NextResponse.json(
        { message: "Summary already exists.", data: existingSummary.response },
        { status: 200 }
      );
    }

    // Check user coins ONLY for new summaries
    const userCoins = await getUserCoins(session?.user?.id!);
    if (userCoins == null || userCoins?.coins < 10) {
      return NextResponse.json(
        {
          message: "You do not have sufficient coins for summary. Please add more coins.",
          insufficientCoins: true,
          currentCoins: userCoins?.coins || 0
        },
        { status: 403 }
      );
    }

    let text: Document<Record<string, any>>[];

    try {
      console.log("🎬 Fetching transcript using YouTube Data API v3");
      console.log("   URL:", body.url);

      const result = await getYouTubeTranscript(body.url);
      
      if (!result || !result.text || result.text.trim().length === 0) {
        return NextResponse.json(
          {
            message:
              "No transcript found. Please ensure the video has English captions/subtitles enabled.",
          },
          { status: 400 }
        );
      }
      
      // Convert to Document format for processing
      text = [new Document({
        pageContent: result.text,
        metadata: {
          title: result.title,
          description: result.description,
          channelTitle: result.channelTitle,
          source: body.url
        }
      })];
      
      console.log("✅ Transcript loaded successfully!");
      console.log(`   Title: ${result.title}`);
      console.log(`   Channel: ${result.channelTitle}`);
      console.log(`   Content length: ${result.text.length} characters`);
      
    } catch (error) {
      console.error("❌ YouTube Transcript Error:", error);
      return NextResponse.json(
        {
          message:
            error instanceof Error ? error.message : "Failed to load video transcript. Please try another video with captions.",
        },
        { status: 400 }
      );
    }

    const splitter = new TokenTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 500,
    });
    const docsSummary = await splitter.splitDocuments(text);
    const summaryPrompt = PromptTemplate.fromTemplate(summaryTemplate);

    console.log(`Processing ${docsSummary.length} document chunks...`);

    let finalSummary: string;

    try {
      // If only one chunk, process directly
      if (docsSummary.length === 1) {
        console.log("Single chunk detected, processing directly...");
        const prompt = await summaryPrompt.format({ text: docsSummary[0].pageContent });
        const response = await gptModal.invoke(prompt);
        finalSummary = typeof response.content === 'string' 
          ? response.content 
          : JSON.stringify(response.content);
      } else {
        // For multiple chunks, process each chunk and combine
        console.log(`Processing ${docsSummary.length} chunks with map-reduce approach...`);
        
        const chunkSummaries: string[] = [];
        
        // Map phase: Summarize each chunk
        for (let i = 0; i < docsSummary.length; i++) {
          console.log(`Processing chunk ${i + 1}/${docsSummary.length}...`);
          const prompt = await summaryPrompt.format({ text: docsSummary[i].pageContent });
          const response = await gptModal.invoke(prompt);
          const chunkSummary = typeof response.content === 'string' 
            ? response.content 
            : JSON.stringify(response.content);
          chunkSummaries.push(chunkSummary);
        }
        
        // Reduce phase: Combine all summaries
        console.log("Combining all chunk summaries...");
        const combinePrompt = `You are an expert in summarizing content. Below are multiple summaries of different parts of a YouTube video. Combine them into a single coherent summary in Markdown format.

### Summaries to Combine:
${chunkSummaries.map((summary, i) => `\n#### Part ${i + 1}:\n${summary}`).join('\n')}

### Instructions:
- Create a unified summary that flows naturally
- Merge duplicate information
- Keep the Markdown formatting
- Include all important questions and answers

### Combined Summary:`;
        
        const finalResponse = await gptModal.invoke(combinePrompt);
        finalSummary = typeof finalResponse.content === 'string' 
          ? finalResponse.content 
          : JSON.stringify(finalResponse.content);
      }

      console.log("✅ Summary generated successfully!");

      // Save to database with error handling
      try {
        console.log("💰 Deducting coins from user:", session?.user?.id);
        await minusCoins(session?.user?.id!);
        
        console.log("💸 Recording coin spend for summary:", body?.id);
        await coinsSpend(session?.user?.id!, body?.id!);
        
        console.log("💾 Updating summary in database");
        await updateSummary(finalSummary, body?.id!);
        
        console.log("✅ All database operations completed successfully!");
      } catch (dbError) {
        console.error("❌ Database error while saving summary:", dbError);
        // Return the summary anyway since it was generated
        // But log the error for investigation
      }

      return NextResponse.json({
        message: "Podcast video Summary",
        data: finalSummary,
      });

    } catch (error) {
      console.error("Error generating summary:", error);
      return NextResponse.json(
        { error: "Failed to generate summary. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong. Pls try again later." },
      { status: 500 }
    );
  }
}
