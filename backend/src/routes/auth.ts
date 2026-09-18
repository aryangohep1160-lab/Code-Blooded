import { Router } from 'express';
import { signup, login, getProfile, deleteAccount } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.delete('/profile', authenticateToken, deleteAccount);

export default router;
