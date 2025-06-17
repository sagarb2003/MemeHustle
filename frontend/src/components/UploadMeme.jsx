import React, { useState } from 'react';
import { api } from '../services/api';

export const UploadMeme = ({ onMemeUploaded }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        owner_id: 'mock-user-id', // Replace with actual user ID
      });

      setTitle('');
      setImageUrl('');
      setTags('');
      onMemeUploaded();
    } catch (error) {
      console.error('Failed to upload meme:', error);
      setError('Failed to upload meme. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black border-2 border-neon-blue p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="glitch-text text-2xl font-bold mb-6">Upload New Meme</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="terminal-text block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="cyber-input w-full"
            placeholder="Enter meme title"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="terminal-text block mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="cyber-input w-full"
            placeholder="Enter image URL"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="tags" className="terminal-text block mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="cyber-input w-full"
            placeholder="funny, cyberpunk, ai"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-neon-pink text-sm mt-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="cyber-button w-full mt-6"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Meme'
          )}
        </button>
      </form>
    </div>
  );
};
