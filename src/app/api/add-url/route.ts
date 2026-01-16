import { getUserCoins } from "@/actions/fetchActions";
import { summarySchema } from "@/validation/summaryValidation";
import vine , {errors} from "@vinejs/vine";
import { getToken } from "next-auth/jwt";
import {NextRequest, NextResponse} from "next/server"
import {Document} from "@langchain/core/documents"
import prisma from "@/lib/db.config";
import { getYouTubeTranscript } from "@/lib/youtube";

export async function POST(req: NextRequest) {
    try{
        
        // const token = getToken({req});
        // if(!token){
        //     return NextResponse.json({message:"Unauthorized"}, {status:401});
        // }

        let body;
        try {
            body = await req.json();
        } catch (error) {
            console.error("❌ Invalid JSON in request body");
            return NextResponse.json({
                message: "Invalid request. Please provide valid JSON data."
            }, {status:400});
        }

        if (!body || !body.url) {
            return NextResponse.json({
                message: "URL is required"
            }, {status:400});
        }

        const validator  = vine.compile(summarySchema);
        const payload = await validator.validate(body);

        const userCoins = await getUserCoins(payload.user_id);
        if(userCoins == null || (userCoins?.coins && userCoins?.coins < 10)){
            return NextResponse.json({message:"You do not have sufficient coins for summary. Pls add more coins."}, {status:403});
        }
        
        let transcriptData: { text: string; title: string };

        try {
            console.log("🎬 Fetching transcript using YouTube Data API v3");
            console.log("   URL:", payload.url);

            const result = await getYouTubeTranscript(payload.url);
            
            if (!result || !result.text || result.text.trim().length === 0) {
                console.error("❌ No transcript text returned");
                return NextResponse.json({
                    message:"No transcript found for this video. Please ensure the video has captions enabled."
                }, {status:400});
            }
            
            transcriptData = {
                text: result.text,
                title: result.title
            };
            
            console.log("✅ Transcript loaded successfully!");
            console.log(`   Title: ${result.title}`);
            console.log(`   Channel: ${result.channelTitle}`);
            console.log(`   Content length: ${result.text.length} characters`);
            console.log(`   First 100 chars: ${result.text.substring(0, 100)}...`);

        } catch (error) {
            console.error("❌ Transcript fetch error:");
            console.error("   Error type:", error?.constructor?.name);
            console.error("   Error message:", error instanceof Error ? error.message : String(error));
            return NextResponse.json({
                message: error instanceof Error ? error.message : "No transcript found for this video. Please try with another video that has English captions."
            }, {status:400});
        }

        const summary = await prisma.summary.create({
            data: {
                ...payload,
                user_id: Number(payload.user_id),
                title: transcriptData.title ?? "YouTube Video Summary"
            }
        });

        return NextResponse.json({message:"url added successfully", data :summary});

    }catch(err){
        console.log("Error in add-url route:", err);
        if(err instanceof errors.E_VALIDATION_ERROR){
            return NextResponse.json({
                message: "Please check Validation error",
                errors: err.messages
            }, {status:422});
        }
        return NextResponse.json({message:"Something went wrong . Pls try again later."}, {status:500});
    }
}