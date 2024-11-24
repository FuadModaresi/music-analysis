// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('musicFile') as Blob;

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const audioData = new FormData();
  audioData.append('file', file);

  // Using Hugging Face API with Whisper model for transcription
  const response = await axios.post('https://transcribe.whisperapi.com', audioData, {
    headers: {
      Authorization: `https://transcribe.whisperapi.comsk-proj-MhgUqbie0yjRg-h8zeMCGQUAQBjfEj2zhLQaTK844cEnxB3TMBT0vny5tY0pmFc1iybac3XUV0T3BlbkFJQhr2AUa4CJLRoSWInWNP0dV80wIazxBf4T_MHzr-IyC7GARFIROVXMTBZYu597IMypjm3MTKQA`, // Replace with your Hugging Face API key
    },
  });

  return NextResponse.json(response.data);
}
