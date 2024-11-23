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
  const response = await axios.post('https://api-inference.huggingface.co/models/openai/whisper', audioData, {
    headers: {
      Authorization: `Bearer YOUR_HUGGING_FACE_API_KEY`, // Replace with your Hugging Face API key
    },
  });

  return NextResponse.json(response.data);
}
