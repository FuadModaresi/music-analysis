import { NextRequest, NextResponse } from 'next/server';
import * as musicMetadata from 'music-metadata';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('musicFile') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse metadata
    const metadata = await musicMetadata.parseBuffer(
      Buffer.from(arrayBuffer),
      {
        mimeType: file.type,
        size: file.size
      }
    );

    // Format duration to minutes:seconds
    const minutes = Math.floor(metadata.format.duration || 0);
    const seconds = Math.round(((metadata.format.duration || 0) % 1) * 60);
    const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Create a detailed transcription
    const transcription = [
      metadata.common.title ? `Title: ${metadata.common.title}` : 'Untitled',
      metadata.common.artist ? `Artist: ${metadata.common.artist}` : null,
      metadata.common.album ? `Album: ${metadata.common.album}` : null,
      metadata.common.year ? `Year: ${metadata.common.year}` : null,
      metadata.common.genre?.length ? `Genre: ${metadata.common.genre.join(', ')}` : null,
      `Duration: ${durationStr}`,
      `Format: ${metadata.format.container || 'Unknown'} (${metadata.format.codec || 'Unknown codec'})`,
      `Bitrate: ${Math.round((metadata.format.bitrate || 0) / 1000)} kbps`,
      `Sample Rate: ${metadata.format.sampleRate} Hz`,
      `Channels: ${metadata.format.numberOfChannels}`
    ]
    .filter(Boolean)
    .join('\n');

    // Simulate dynamic note extraction
    const simulateNoteExtraction = (duration: number): { pitch: string, duration: string, startTime: number }[] => {
      const pitches = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
      const noteDurations = ['quarter', 'half', 'whole'];
      const notes = [];
      let currentTime = 0;

      while (currentTime < duration) {
        const pitch = pitches[Math.floor(Math.random() * pitches.length)];
        const noteDuration = noteDurations[Math.floor(Math.random() * noteDurations.length)];
        const noteDurationTime = noteDuration === 'whole' ? 4 : noteDuration === 'half' ? 2 : 1;

        notes.push({ pitch, duration: noteDuration, startTime: currentTime });
        currentTime += noteDurationTime * 0.5; // Simulate time progression
      }

      return notes;
    };

    const notes = simulateNoteExtraction(metadata.format.duration || 3);

    const analysis = {
      transcription,
      duration: metadata.format.duration,
      sampleRate: metadata.format.sampleRate,
      numberOfChannels: metadata.format.numberOfChannels,
      bitrate: metadata.format.bitrate,
      format: metadata.format.container,
      confidence: 0.8,
      notes,
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        genre: metadata.common.genre
      }
    };

    return new NextResponse(JSON.stringify(analysis), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to process audio file. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
}
