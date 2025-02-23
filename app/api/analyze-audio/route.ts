import { NextResponse } from 'next/server';
import * as musicMetadata from 'music-metadata';

// Define allowed methods
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
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

    const analysis = {
      transcription,
      duration: metadata.format.duration,
      sampleRate: metadata.format.sampleRate,
      numberOfChannels: metadata.format.numberOfChannels,
      bitrate: metadata.format.bitrate,
      format: metadata.format.container,
      confidence: 0.8,
      metadata: {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        year: metadata.common.year,
        genre: metadata.common.genre
      }
    };

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process audio file. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
