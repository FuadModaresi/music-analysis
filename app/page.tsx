import UploadMusic from '@/components/UploadMusic';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-darkBg text-white px-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-accent">Music AI Analyzer</h1>
        <p className="max-w-xl text-gray-300">
          This app by Fuad_MD lets you upload an audio file and analyze it for musical notes or transcriptions.
          Start by uploading a file, and the app will provide a list of detected notes or transcribed text.
          Here’s an example of what you might see once the analysis is complete.
        </p>
        <UploadMusic />
      </div>
    </main>
  );
}
