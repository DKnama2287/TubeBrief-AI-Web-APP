import { google } from 'googleapis';
import { YoutubeTranscript } from 'youtube-transcript';

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

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export async function getYouTubeTranscript(url: string): Promise<YouTubeTranscriptResult> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error('Invalid YouTube URL');

  console.log('🎬 Fetching video details for:', videoId);

  // Step 1: Get video metadata via YouTube Data API
  const videoResponse = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  if (!videoResponse.data.items?.length) {
    throw new Error('Video not found');
  }

  const snippet = videoResponse.data.items[0].snippet!;
  const title = snippet.title || 'Unknown Title';
  const description = snippet.description || '';
  const channelTitle = snippet.channelTitle || 'Unknown Channel';

  console.log('✅ Video found:', title);

  // Step 2: Fetch transcript using youtube-transcript (no OAuth needed)
  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });

    if (transcriptItems && transcriptItems.length > 0) {
      const text = transcriptItems
        .map((item) => item.text.trim())
        .filter(Boolean)
        .join(' ');

      console.log('✅ Transcript fetched via youtube-transcript');
      console.log(`   Length: ${text.length} characters`);

      return { text, title, description, channelTitle };
    }

    // Try without language filter if English not found
    const allItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (allItems && allItems.length > 0) {
      const text = allItems
        .map((item) => item.text.trim())
        .filter(Boolean)
        .join(' ');

      console.log('✅ Transcript fetched (auto-detected language)');
      console.log(`   Length: ${text.length} characters`);

      return { text, title, description, channelTitle };
    }
  } catch (transcriptError) {
    console.warn('⚠️ youtube-transcript failed:', (transcriptError as Error).message);
  }

  // Step 3: Fallback to video description
  if (description && description.length > 100) {
    console.log('⚠️ No transcript available — using video description as fallback');
    return { text: description, title, description, channelTitle };
  }

  throw new Error(
    'No transcript available for this video. Please try a video with captions enabled.'
  );
}
