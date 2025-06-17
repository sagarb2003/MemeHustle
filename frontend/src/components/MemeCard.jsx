import React, { useState } from 'react';
import { api } from '../services/api';

export const MemeCard = ({ meme, onUpdate, onBidNotification }) => {
  const [bidAmount, setBidAmount] = useState(0);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    if (bidAmount <= 0 || !userId.trim()) {
      alert('Please enter a valid user ID and bid amount');
      return;
    }

    try {
      setIsLoading(true);
      await api.placeBid({
        meme_id: meme.id,
        user_id: userId.trim(),
        credits: bidAmount
      });
      setBidAmount(0);
      // Success feedback
      const button = document.querySelector(`#bid-btn-${meme.id}`);
      if (button) {
        button.textContent = '✅ BID PLACED';
        setTimeout(() => {
          button.textContent = '💎 BID';
        }, 2000);
      }
    } catch (error) {
      console.error('Bid failed:', error);
      alert('Bid failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="meme-card relative overflow-hidden group bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm border-2 border-neon-blue/30 rounded-2xl shadow-2xl transition-all duration-500 hover:border-neon-pink hover:shadow-neon-pink/20 hover:shadow-2xl">
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue via-neon-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-[2px] rounded-2xl bg-gradient-to-br from-gray-900 to-black"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Title */}
        <div className="text-center mb-4">
          <h3 className="glitch-text text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent truncate">
            {meme.title}
          </h3>
          <div className="w-16 h-0.5 bg-gradient-to-r from-neon-blue to-neon-pink mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl mb-4 border border-neon-blue/30 bg-black/50">
          {!imageLoaded && !imageError && (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          {imageError ? (
            <div className="w-full h-64 flex items-center justify-center bg-gray-800/50">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-400 text-sm">Image failed to load</p>
              </div>
            </div>
          ) : (
            <img
              src={meme.image_url}
              alt={meme.title}
              className={`w-full h-64 object-cover transform transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Vibe Badge */}
        <div className="mb-4">
          <div className="inline-flex items-center space-x-2 bg-black/70 px-3 py-1.5 rounded-full border border-cyber-purple/50">
            <span className="text-cyber-yellow text-xs font-medium">VIBE:</span>
            <span className="text-cyber-purple text-xs font-bold uppercase tracking-wide">{meme.vibe}</span>
          </div>
        </div>

        {/* Caption */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm">
            {meme.caption.split(' ').slice(0, 30).join(' ')}
            {meme.caption.split(' ').length > 30 ? '...' : ''}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {meme.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-cyber-purple/20 to-neon-pink/20 text-cyber-purple border border-cyber-purple/30 rounded-full text-xs font-medium hover:bg-cyber-purple/30 transition-all duration-200 cursor-default"
            >
              #{tag}
            </span>
          ))}
          {meme.tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-800/50 text-gray-400 border border-gray-600/30 rounded-full text-xs font-medium">
              +{meme.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Voting Section */}
        <div className="flex items-center justify-between mb-4 bg-black/40 p-3 rounded-xl border border-neon-blue/20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleVote('upvote')}
              disabled={isLoading}
              className="group/btn relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative z-10">⬆️</span>
              <span className="relative z-10 text-white">{meme.upvotes}</span>
            </button>
            
            <button
              onClick={() => handleVote('downvote')}
              disabled={isLoading}
              className="group/btn relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-lg font-bold transition-all duration-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative z-10">⬇️</span>
            </button>
          </div>
          
          <div className="text-xs text-gray-400">
            {meme.upvotes} votes
          </div>
        </div>

        {/* Bidding Section */}
        <div className="bg-gradient-to-r from-neon-blue/5 to-neon-pink/5 p-4 rounded-xl border border-neon-blue/20">
          <div className="flex items-center justify-center mb-3">
            <h4 className="text-neon-pink font-bold text-sm">💎 PLACE YOUR BID</h4>
          </div>
          
          {/* User ID Input */}
          <div className="mb-3">
            <label className="block text-cyber-yellow text-xs font-medium mb-1.5">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-black/70 border border-neon-blue/40 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:border-neon-pink focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-neon-pink/50"
              placeholder="Enter username"
            />
          </div>

          {/* Bid Amount and Button */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <label className="block text-cyber-yellow text-xs font-medium mb-1.5">
                Credits
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full bg-black/70 border border-neon-blue/40 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:border-neon-pink focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-neon-pink/50"
                placeholder="Amount"
                min="0"
              />
            </div>
            
            <button
              id={`bid-btn-${meme.id}`}
              onClick={handleBid}
              disabled={isLoading || bidAmount <= 0 || !userId.trim()}
              className="group/bid relative bg-gradient-to-r from-neon-pink to-cyber-purple hover:from-neon-pink/80 hover:to-cyber-purple/80 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/bid:translate-y-[-100%] transition-transform duration-300"></div>
              <span className="relative z-10">
                {isLoading ? '⏳' : '💎 BID'}
              </span>
            </button>
          </div>
        </div>

        {/* Creator Info */}
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-400">
              Created by: <span className="text-neon-blue font-medium">{meme.owner_id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
          <div className="text-center">
            <div className="flex space-x-1 mb-2">
              <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-neon-blue text-sm font-medium">Processing...</p>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .glitch-text {
          position: relative;
          text-shadow: 
            0.05em 0 0 #00ffff,
            -0.05em -0.025em 0 #ff00ff,
            0.025em 0.05em 0 #ffff00;
        }

        .glitch-text:hover {
          animation: glitch 0.3s;
        }

        @keyframes glitch {
          0% {
            text-shadow: 
              0.05em 0 0 #00ffff,
              -0.05em -0.025em 0 #ff00ff,
              0.025em 0.05em 0 #ffff00;
          }
          15% {
            text-shadow: 
              0.05em 0 0 #00ffff,
              -0.05em -0.025em 0 #ff00ff,
              0.025em 0.05em 0 #ffff00;
          }
          16% {
            text-shadow: 
              -0.05em -0.025em 0 #00ffff,
              0.025em 0.025em 0 #ff00ff,
              -0.05em -0.05em 0 #ffff00;
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 #00ffff,
              0.025em 0.025em 0 #ff00ff,
              -0.05em -0.05em 0 #ffff00;
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 #00ffff,
              0.05em 0 0 #ff00ff,
              0 -0.05em 0 #ffff00;
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 #00ffff,
              0.05em 0 0 #ff00ff,
              0 -0.05em 0 #ffff00;
          }
          100% {
            text-shadow: 
              0.05em 0 0 #00ffff,
              -0.05em -0.025em 0 #ff00ff,
              0.025em 0.05em 0 #ffff00;
          }
        }
      `}</style>
    </div>
  );
};