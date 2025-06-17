import React, { useState } from 'react';
import { MemeGallery } from './components/MemeGallery';
import UploadMeme  from './components/UploadMeme';

function App() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-mono">
      {/* Header */}
      <header className="border-b border-purple-500 p-6 shadow-lg bg-black bg-opacity-60 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-purple-400 animate-pulse">
            MemeHustle
          </h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition duration-200"
          >
            {showUpload ? 'View Gallery' : 'Upload Meme'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col-reverse lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-grow">
            {showUpload ? (
              <UploadMeme onMemeUploaded={() => setShowUpload(false)} />
            ) : (
              <MemeGallery />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
