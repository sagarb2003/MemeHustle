import React, { useState } from 'react';
import { api } from '../services/api';

export const MemeCard = ({ meme, onUpdate }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (type) => {
    try {
      setIsLoading(true);
      const updatedMeme = await api.vote(meme.id, type);
      onUpdate(updatedMeme);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBid = async () => {
    if (bidAmount <= 0) return;

    try {
      setIsLoading(true);
      await api.placeBid({
        meme_id: meme.id,
        user_id: 'mock-user-id', // Replace with actual user ID
        credits: bidAmount
      });
      setBidAmount(0);
    } catch (error) {
      console.error('Bid failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meme-card relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-pink to-cyber-purple"></div>

      <h3 className="glitch-text text-xl font-bold mb-2">{meme.title}</h3>

      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>

      <div className="terminal-text mb-4">
        <p className="animate-terminal-typing overflow-hidden whitespace-nowrap">
          {meme.caption}
        </p>
        <p className="text-cyber-yellow text-sm mt-1">{meme.vibe}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {meme.tags.map((tag, index) => (
          <span key={index} className="tag-pill">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('upvote')}
            disabled={isLoading}
            className="cyber-button"
          >
            ⬆️ {meme.upvotes}
          </button>
          <button
            onClick={() => handleVote('downvote')}
            disabled={isLoading}
            className="cyber-button"
          >
            ⬇️
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="cyber-input w-24"
            placeholder="Credits"
            min="0"
          />
          <button
            onClick={handleBid}
            disabled={isLoading || bidAmount <= 0}
            className="cyber-button"
          >
            Bid
          </button>
        </div>
      </div>

      <div className="text-sm text-neon-blue">
        Created by: {meme.owner_id}
      </div>
    </div>
  );
};
