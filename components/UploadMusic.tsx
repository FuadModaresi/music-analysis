"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

interface AnalysisResult {
  transcription: string;
  confidence?: number;
  duration?: number;
  waveform?: number[];
}

export default function UploadMusic() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      setError(null);
      
      // Create audio preview URL
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac']
    },
    maxFiles: 1,
    multiple: false
  });

  const analyzeWaveform = async (file: File) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / 100);
    const waveform = [];
    
    for (let i = 0; i < channelData.length; i += step) {
      waveform.push(Math.abs(channelData[i]));
    }
    
    return waveform;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file first");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('musicFile', file);

    try {
      const waveform = await analyzeWaveform(file);
      const response = await axios.post('/api/analyze-audio', formData);
      setAnalysisResult({ ...response.data, waveform });
    } catch (error: any) {
      console.error("Error analyzing audio:", error);
      setError(
        error.response?.data?.error || 
        "Failed to analyze the audio file. Please try again."
      );
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysisResult?.waveform && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3B82F6';
      
      analysisResult.waveform.forEach((value, index) => {
        const barWidth = canvas.width / analysisResult.waveform!.length;
        const barHeight = value * canvas.height;
        ctx.fillRect(
          index * barWidth,
          canvas.height - barHeight,
          barWidth - 1,
          barHeight
        );
      });
    }
  }, [analysisResult]);

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50">
        {!analysisResult ? (
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-300
              ${isDragActive 
                ? 'border-accent bg-accent/10 animate-pulse-border' 
                : 'border-gray-600 hover:border-gray-500'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="text-4xl">🎵</div>
              {isDragActive ? (
                <p className="text-accent">Drop your audio file here...</p>
              ) : (
                <>
                  <p className="text-lg">
                    Drag & drop your audio file here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports MP3, WAV, M4A, and AAC
                  </p>
                </>
              )}
            </div>
          </div>
        ) : null}

        {file && !analysisResult && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Selected File:</h3>
              <p className="text-gray-400">{file.name}</p>
              {audioUrl && (
                <audio 
                  controls 
                  className="w-full mt-3" 
                  src={audioUrl}
                />
              )}
              <canvas 
                ref={canvasRef}
                className="w-full h-32 bg-gray-900/50 rounded-lg"
                width={800}
                height={128}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={resetAnalysis}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  px-6 py-2 rounded-lg font-medium
                  ${loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent/90'
                  }
                  transition-colors
                `}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Music'
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <div className="space-y-4">
                <div className="text-lg font-mono bg-black/30 p-4 rounded">
                  {analysisResult.transcription}
                </div>
                {analysisResult.confidence && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>Confidence:</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent"
                        style={{ width: `${analysisResult.confidence * 100}%` }}
                      />
                    </div>
                    <span>{Math.round(analysisResult.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={resetAnalysis}
              className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg transition-colors"
            >
              Analyze Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}