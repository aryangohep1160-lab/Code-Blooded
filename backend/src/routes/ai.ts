import { Router } from 'express';
import { handleAiChat } from '../controllers/aiController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/chat', authenticateToken, handleAiChat);

export default router;
