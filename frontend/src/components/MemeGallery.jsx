import React, { useState, useEffect } from 'react';
import { MemeCard } from './MemeCard';
import { Leaderboard } from './LeaderBoard';
import { api } from '../services/api';
import { socketService } from '../services/socket';

export const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bidNotification, setBidNotification] = useState(null);

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
    const handleBidUpdate = ({ meme_id, bid }) => {
      setMemes(prevMemes =>
        prevMemes.map(meme =>
          meme.id === meme_id
            ? { ...meme, bids: [...(meme.bids || []), bid] }
            : meme
        )
      );
      
      const targetMeme = memes.find(m => m.id === meme_id);
      setBidNotification({
        message: `${bid.user_id} bid ${bid.credits} credits on "${targetMeme?.title || 'a meme'}"!`,
        id: Date.now()
      });

      setTimeout(() => {
        setBidNotification(null);
      }, 5000);
    };

    const handleVoteUpdate = ({ meme_id, meme }) => {
      setMemes(prevMemes =>
        prevMemes.map(m => (m.id === meme_id ? meme : m))
      );
    };

    socketService.subscribe('bid_update', handleBidUpdate);
    socketService.subscribe('vote_update', handleVoteUpdate);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="terminal-text text-xl text-neon-blue">Loading cyberpunk memes...</p>
          <div className="mt-4 h-1 w-64 mx-auto bg-gradient-to-r from-neon-blue via-neon-pink to-cyber-purple rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-screen">
          
          {/* Left Section - Memes */}
          <div className="xl:col-span-3">

            {memes.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🤖</div>
                <p className="terminal-text text-xl text-neon-blue mb-2">No memes detected in the matrix...</p>
                <p className="text-gray-400">Be the first to upload a cyberpunk meme!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top 2 Memes - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {memes.slice(0, 2).map((meme) => (
                    <div key={meme.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                      <MemeCard
                        meme={meme}
                        onUpdate={handleMemeUpdate}
                      />
                    </div>
                  ))}
                </div>

                {/* Remaining Memes - Single Column */}
                {memes.length > 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
                      <span className="px-4 text-neon-blue font-bold">MORE MEMES</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {memes.slice(2).map((meme) => (
                        <div key={meme.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                          <MemeCard
                            meme={meme}
                            onUpdate={handleMemeUpdate}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Leaderboard */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>

      {/* Bid Notification */}
      {bidNotification && (
        <div className="fixed top-6 right-6 z-50 max-w-sm">
          <div className="bg-gradient-to-r from-neon-blue to-cyber-purple text-white p-4 rounded-lg shadow-2xl border border-neon-pink/50 transform animate-slide-in-right">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💎</div>
              <div>
                <p className="font-bold text-sm mb-1">New Bid Alert!</p>
                <p className="text-xs opacity-90">{bidNotification.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }

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

        .terminal-text {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </div>
  );
};