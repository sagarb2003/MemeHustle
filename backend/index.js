require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
    'http://localhost:5173',
    'https://meme-hustle-nine.vercel.app'
  ];
  
  // Express CORS
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
  
  // Socket.IO CORS
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  app.use(express.json());

// Supabase Setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Google Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI Functions
async function generateCaption(tags) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Generate a single line funny caption for a meme with emojis with tags: ${tags.join(', ')} in 15 words`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Caption generation failed:', error);
    return 'YOLO to the moon!';
  }
}

async function analyzeVibe(tags) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Give a one-line vibe for tags: ${tags.join(', ')}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Vibe analysis failed:', error);
    return 'Maximum cyberpunk vibes!';
  }
}

// API Routes

app.get('/',(req,res)=>{
    res.send('Backend is running')
})

app.post('/memes', async (req, res) => {
  try {
    const { title, image_url, tags, owner_id } = req.body;
    const caption = await generateCaption(tags);
    const vibe = await analyzeVibe(tags);

    const { data, error } = await supabase
      .from('memes')
      .insert([
        {
          title,
          image_url,
          tags,
          owner_id,
          caption,
          vibe,
          upvotes: 0
        }
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/memes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simplified /bids route - only emits socket message
app.post('/bids', async (req, res) => {
  try {
    const { meme_id, user_id, credits } = req.body;
    const { data, error } = await supabase
      .from('bids')
      .insert([{ meme_id, user_id, credits }])
      .select();

    if (error) throw error;
    
    // Emit simplified message format
    const message = `User ${user_id} bid ${credits} credits!`;
    io.emit('bid_update', { message, meme_id, bid: data[0] });
    
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/bids/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('meme_id', id)
        .order('credits', { ascending: false })
        .limit(1);
  
      if (error) throw error;
      res.json(data[0] || null);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.post('/votes', async (req, res) => {
  try {
    const { meme_id, vote_type } = req.body;
    const increment = vote_type === 'upvote' ? 1 : -1;

    // Step 1: Fetch current upvotes
    const { data: currentData, error: fetchError } = await supabase
      .from('memes')
      .select('upvotes')
      .eq('id', meme_id)
      .single();

    if (fetchError) throw fetchError;

    const newUpvotes = currentData.upvotes + increment;

    // Step 2: Update with new upvotes
    const { data, error } = await supabase
      .from('memes')
      .update({ upvotes: newUpvotes })
      .eq('id', meme_id)
      .select();

    if (error) throw error;

    io.emit('vote_update', { meme_id, meme: data[0] });
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simplified leaderboard without caching - just sort by upvotes
app.get('/leaderboard', async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;

    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('upvotes', { ascending: false })
      .limit(top);

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});