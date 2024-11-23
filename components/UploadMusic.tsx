// components/UploadMusic.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadMusic() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Default example result for demo purposes
  const exampleResult = "🎶 Sample Notes: C - E - G - A - D (This example shows detected notes or transcription text based on the uploaded file).";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('musicFile', file);

    try {
      const { data } = await axios.post('/api/analyze', formData);
      setAnalysisResult(data.transcription); // Adjust this based on actual response format
    } catch (error) {
      console.error("Error analyzing audio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-darkBg text-white rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-center text-xl font-semibold mb-6">Music AI Analyzer</h2>
      <p className="mb-4 text-gray-400">
        Upload an audio file to get the musical notes or transcription. Here’s a sample output to demonstrate the app’s functionality.
      </p>
      <div className="bg-gray-800 p-4 rounded text-center mb-6 text-gray-300">
        {analysisResult || exampleResult}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept="audio/*"
          className="mb-4 text-accent"
        />
        <button
          type="submit"
          className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Music"}
        </button>
      </form>
    </div>
  );
}
