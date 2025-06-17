import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState({ byVotes: [], byBids: [] });
  const [activeTab, setActiveTab] = useState('votes');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard(5);
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
      <div className="terminal-text animate-pulse p-4">
        Loading leaderboard data...
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-neon-blue p-4 rounded-lg">
      <h2 className="glitch-text text-2xl font-bold mb-4">Leaderboard</h2>

      <div className="flex mb-4 space-x-2">
        <button
          className={`cyber-button ${activeTab === 'votes' ? 'bg-neon-pink text-white' : ''}`}
          onClick={() => setActiveTab('votes')}
        >
          Top Voted
        </button>
        <button
          className={`cyber-button ${activeTab === 'bids' ? 'bg-neon-pink text-white' : ''}`}
          onClick={() => setActiveTab('bids')}
        >
          Top Bids
        </button>
      </div>

      <div className="space-y-4">
        {(activeTab === 'votes' ? leaderboard.byVotes : leaderboard.byBids).map((meme, index) => (
          <div
            key={meme.id}
            className="flex items-center space-x-4 p-2 border border-neon-blue rounded-lg hover:border-neon-pink transition-colors duration-300"
          >
            <div className="terminal-text text-2xl font-bold min-w-[2rem]">
              #{index + 1}
            </div>
            <img
              src={meme.image_url}
              alt={meme.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-grow">
              <h3 className="text-neon-blue font-bold">{meme.title}</h3>
              <div className="flex space-x-2">
                {meme.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="tag-pill text-xs">
                    #{tag}
                  </span>
                ))}
                {meme.tags.length > 2 && (
                  <span className="text-cyber-purple text-xs">+{meme.tags.length - 2}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-neon-pink font-bold">
                {activeTab === 'votes' ? (
                  <span>⬆️ {meme.upvotes}</span>
                ) : (
                  <span>💎 {meme.bids?.[0]?.credits || 0}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
