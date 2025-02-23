import UploadMusic from '@/components/UploadMusic';
import '@/styles/animations.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="w-full bg-black/30 backdrop-blur-sm py-6 px-4 fixed top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
            <span className="text-3xl">🎵</span> Music AI Analyzer
          </h1>
          <a 
            href="https://github.com/FuadModaresi/music-analysis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text animate-float">
              Analyze Your Music with AI
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Upload your audio file and let our AI analyze its musical elements.
              Get detailed insights about notes, rhythm, and more in seconds.
            </p>
          </div>
          
          <UploadMusic />

          {/* Features Section */}
          <div className="mt-24 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎼",
                title: "Note Detection",
                description: "Identify musical notes and their durations with high accuracy"
              },
              {
                icon: "⚡",
                title: "Real-time Analysis",
                description: "Get instant feedback as soon as you upload your audio file"
              },
              {
                icon: "📊",
                title: "Detailed Insights",
                description: "Receive comprehensive analysis of your music's structure"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-6 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p> {new Date().getFullYear()} Music AI Analyzer. Made with fuadroid</p>
        </div>
      </footer>
    </main>
  );
}
