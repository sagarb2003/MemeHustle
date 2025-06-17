import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard(10);
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm border-2 border-neon-blue/30 rounded-2xl p-6 shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyber-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="terminal-text text-sm text-neon-blue">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm border-2 border-neon-blue/30 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 p-4 border-b border-neon-blue/30">
        <div className="text-center">
          <h2 className="glitch-text text-xl font-bold bg-gradient-to-r from-neon-blue via-neon-pink to-cyber-purple bg-clip-text text-transparent">
            🏆 TOP MEMES
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-neon-blue to-neon-pink mx-auto mt-2 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🤖</div>
            <p className="terminal-text text-sm text-gray-400">No data detected...</p>
            <p className="text-xs text-gray-500 mt-1">Upload memes to see rankings!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((meme, index) => (
              <div
                key={meme.id}
                className={`relative flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] group ${
                  index === 0
                    ? 'border-yellow-400/50 bg-gradient-to-r from-yellow-900/10 to-yellow-800/10 hover:border-yellow-400'
                    : index === 1
                    ? 'border-gray-400/50 bg-gradient-to-r from-gray-900/10 to-gray-800/10 hover:border-gray-400'
                    : index === 2
                    ? 'border-orange-400/50 bg-gradient-to-r from-orange-900/10 to-orange-800/10 hover:border-orange-400'
                    : 'border-neon-blue/30 bg-gradient-to-r from-blue-900/10 to-purple-900/10 hover:border-neon-pink'
                }`}
              >
                {/* Rank Badge */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-black'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-black'
                    : 'bg-gradient-to-r from-neon-blue to-neon-pink text-white'
                } shadow-lg`}>
                  {index === 0 ? '👑' : `${index + 1}`}
                </div>


                {/* Meme Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-neon-blue font-medium text-sm truncate group-hover:text-neon-pink transition-colors duration-300">
                    {meme.title}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    by <span className="text-neon-pink">{meme.owner_id}</span>
                  </p>
                </div>

                {/* Vote Count */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center justify-center space-x-1 bg-neon-pink/20 rounded-full px-2 py-1 border border-neon-pink/30">
                    <span className="text-sm">⬆️</span>
                    <span className="text-neon-pink font-bold text-sm">
                      {meme.upvotes}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-pink/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/30 p-3 border-t border-neon-blue/20">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>🔄 Auto-refresh: 30s</span>
          <span className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
            <span>Live</span>
          </span>
        </div>
      </div>

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

        .terminal-text {
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 5px currentColor;
        }
      `}</style>
    </div>
  );
};