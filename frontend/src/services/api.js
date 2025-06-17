import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL;
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const api = {
  getMemes: async () => {
    const response = await fetch(`${API_URL}/memes`);
    return response.json();
  },

  createMeme: async (meme) => {
    const response = await fetch(`${API_URL}/memes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meme),
    });
    return response.json();
  },

  placeBid: async (bid) => {
    const response = await fetch(`${API_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bid),
    });
    return response.json();
  },
  getHighestBid:async(id)=>{
    const response = await fetch(`${API_URL}/bids/${id}`);
    return response.json();
  },

  vote: async (meme_id, vote_type) => {
    const response = await fetch(`${API_URL}/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meme_id, vote_type }),
    });
    return response.json();
  },

  getLeaderboard: async (top = 10) => {
    const response = await fetch(`${API_URL}/leaderboard?top=${top}`);
    return response.json();
  },
};

export { supabase };
