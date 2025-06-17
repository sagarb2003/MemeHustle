import React, { useState } from 'react';
import { Upload, Image, Tag, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function UploadMeme({ onMemeUploaded }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!title || !imageUrl || !tags) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await api.createMeme({
        title,
        image_url: imageUrl,
        tags: tags.split(',').map(tag => tag.trim()),
        owner_id: 'mock-user-id',
      });

      setTitle('');
      setImageUrl('');
      setTags('');
      if (onMemeUploaded) onMemeUploaded();
    } catch (error) {
      console.error('Failed to upload meme:', error);
      setError('Failed to upload meme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
        
        <div className="relative bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          {/* Header with icon */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-black p-4 rounded-full border border-purple-500/50">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Upload Your Meme
          </h2>

          <div className="space-y-6">
            {/* Title Input */}
            <div className="relative group">
              <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField('title')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 bg-black/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm ${
                    focusedField === 'title' 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/20' 
                      : 'border-gray-600 hover:border-purple-400'
                  }`}
                  placeholder="Enter your epic meme title..."
                  disabled={isLoading}
                />
                {focusedField === 'title' && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Image URL Input */}
            <div className="relative group">
              <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onFocus={() => setFocusedField('imageUrl')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 bg-black/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm ${
                    focusedField === 'imageUrl' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20' 
                      : 'border-gray-600 hover:border-blue-400'
                  }`}
                  placeholder="https://your-awesome-meme-image.jpg"
                  disabled={isLoading}
                />
                {focusedField === 'imageUrl' && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Tags Input */}
            <div className="relative group">
              <label className="block text-purple-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  onFocus={() => setFocusedField('tags')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 bg-black/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm ${
                    focusedField === 'tags' 
                      ? 'border-pink-500 shadow-lg shadow-pink-500/25 ring-2 ring-pink-500/20' 
                      : 'border-gray-600 hover:border-pink-400'
                  }`}
                  placeholder="funny, cyberpunk, ai, viral"
                  disabled={isLoading}
                />
                {focusedField === 'tags' && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur-sm animate-pulse"></div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="relative p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-xl animate-pulse"></div>
                <p className="relative text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="animate-pulse">Uploading to the Matrix...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Upload className="w-5 h-5" />
                    <span>Launch Your Meme</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}