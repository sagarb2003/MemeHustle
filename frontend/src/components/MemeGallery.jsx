import React, { useState, useEffect } from 'react';
import { MemeCard } from './MemeCard';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const data = await api.getMemes();
        setMemes(data);
      } catch (error) {
        console.error('Failed to fetch memes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemes();

    // Subscribe to real-time updates
    socketService.subscribe('bid_update', ({ meme_id, bid }) => {
      setMemes(prevMemes =>
        prevMemes.map(meme =>
          meme.id === meme_id
            ? { ...meme, bids: [...(meme.bids || []), bid] }
            : meme
        )
      );
    });

    socketService.subscribe('vote_update', ({ meme_id, meme }) => {
      setMemes(prevMemes =>
        prevMemes.map(m => (m.id === meme_id ? meme : m))
      );
    });

    return () => {
      socketService.unsubscribe('bid_update');
      socketService.unsubscribe('vote_update');
    };
  }, []);

  const handleMemeUpdate = (updatedMeme) => {
    setMemes(prevMemes =>
      prevMemes.map(meme => (meme.id === updatedMeme.id ? updatedMeme : meme))
    );
  };

  if (isLoading) {
    return (
      <div className="terminal-text animate-pulse text-center py-8">
        <p className="text-2xl">Loading cyberpunk memes...</p>
        <div className="mt-4 h-1 w-48 mx-auto bg-gradient-to-r from-neon-blue via-neon-pink to-cyber-purple rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {memes.map(meme => (
        <MemeCard
          key={meme.id}
          meme={meme}
          onUpdate={handleMemeUpdate}
        />
      ))}
    </div>
  );
};
