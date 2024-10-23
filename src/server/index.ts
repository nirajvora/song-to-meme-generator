import express from 'express';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({
    url: fileUrl,
    duration: 0,
  });
});

app.get('/api/videos', async (req, res) => {
  const { page = 0, hashtags } = req.query;
  const hashtagArray = (hashtags as string).split(',');
  
  // Simulated response for demo
  const videos = Array(20).fill(null).map((_, i) => ({
    id: `${Date.now()}-${i}`,
    url: 'https://example.com/video.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    platform: ['TikTok', 'Instagram', 'YouTube'][Math.floor(Math.random() * 3)],
    engagement: Math.floor(Math.random() * 100000)
  }));

  res.json({
    videos,
    nextCursor: videos.length === 20 ? Number(page) + 1 : undefined,
  });
});

// Create uploads directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('uploads');
} catch (err) {
  if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
    console.error('Error creating uploads directory:', err);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});