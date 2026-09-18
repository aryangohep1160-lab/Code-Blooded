import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReCircle API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
