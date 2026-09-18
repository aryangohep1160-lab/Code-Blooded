import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import aiRoutes from './routes/ai';
import communityRoutes from './routes/community';
import networkRoutes from './routes/network';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/network', networkRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReCircle API is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
