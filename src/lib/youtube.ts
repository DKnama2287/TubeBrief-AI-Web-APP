import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface YouTubeTranscriptResult {
  text: string;
  title: string;
  description: string;
  channelTitle: string;
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get video details and captions using YouTube Data API v3
 */
export async function getYouTubeTranscript(url: string): Promise<YouTubeTranscriptResult> {
  try {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    console.log('🎬 Fetching video details for:', videoId);

    // Get video details
    const videoResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    });

    if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = videoResponse.data.items[0];
    const title = video.snippet?.title || 'Unknown Title';
    const description = video.snippet?.description || '';
    const channelTitle = video.snippet?.channelTitle || 'Unknown Channel';

    console.log('✅ Video found:', title);

    // Get available captions
    const captionsResponse = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId,
    });

    if (!captionsResponse.data.items || captionsResponse.data.items.length === 0) {
      throw new Error('No captions available for this video');
    }

    // Find English caption track
    let captionTrack = captionsResponse.data.items.find(
      (item) => item.snippet?.language === 'en'
    );

    // If no English, take the first available
    if (!captionTrack) {
      captionTrack = captionsResponse.data.items[0];
    }

    const captionId = captionTrack.id;
    console.log('📝 Caption track found:', captionTrack.snippet?.language);

    // Download the caption
    try {
      const captionDownload = await youtube.captions.download({
        id: captionId!,
        tfmt: 'srt', // Get as SRT format
      });

      let transcriptText = '';
      
      if (typeof captionDownload.data === 'string') {
        transcriptText = captionDownload.data;
      } else if (captionDownload.data) {
        transcriptText = JSON.stringify(captionDownload.data);
      }

      // Clean SRT format (remove timestamps and numbers)
      const cleanedText = cleanSRTFormat(transcriptText);

      console.log('✅ Transcript downloaded successfully');
      console.log(`   Length: ${cleanedText.length} characters`);

      return {
        text: cleanedText,
        title,
        description,
        channelTitle,
      };
    } catch (downloadError) {
      console.error('❌ Error downloading caption:', downloadError);
      
      // Fallback: Use video description or throw error
      if (description && description.length > 100) {
        console.log('⚠️ Using video description as fallback');
        return {
          text: description,
          title,
          description,
          channelTitle,
        };
      }
      
      throw new Error('Unable to download captions. The video may have restricted captions.');
    }

  } catch (error) {
    console.error('❌ YouTube API Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get YouTube transcript: ${error.message}`);
    }
    throw new Error('Failed to get YouTube transcript');
  }
}

/**
 * Clean SRT subtitle format
 */
function cleanSRTFormat(srtText: string): string {
  // Remove sequence numbers (e.g., "1", "2", "3")
  let cleaned = srtText.replace(/^\d+\s*$/gm, '');
  
  // Remove timestamps (e.g., "00:00:00,000 --> 00:00:02,000")
  cleaned = cleaned.replace(/\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/g, '');
  
  // Remove extra whitespace and empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  // Join lines into paragraphs
  const lines = cleaned.split('\n').filter(line => line.trim().length > 0);
  cleaned = lines.join(' ');
  
  return cleaned;
}
