import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AudioUploader } from './components/AudioUploader';
import { AudioWaveform } from './components/AudioWaveform';
import { HashtagInput } from './components/HashtagInput';
import { VideoFeed } from './components/VideoFeed';
import { Music } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState({ start: 0, end: 30 });
  const [hashtags, setHashtags] = useState<string[]>([]);

  const handleAudioUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('audio', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setAudioFile(data.url);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Social Media Clip Generator</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">1. Upload Audio</h2>
              {!audioFile ? (
                <AudioUploader onAudioUpload={handleAudioUpload} />
              ) : (
                <AudioWaveform
                  audioUrl={audioFile}
                  onTimeRangeSelect={(start, end) => setTimeRange({ start, end })}
                />
              )}
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">2. Add Hashtags</h2>
              <HashtagInput onHashtagsChange={setHashtags} />
            </section>

            {audioFile && hashtags.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Generated Video Clips</h2>
                <VideoFeed
                  hashtags={hashtags}
                  audioClip={{
                    start: timeRange.start,
                    end: timeRange.end,
                    url: audioFile
                  }}
                />
              </section>
            )}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;