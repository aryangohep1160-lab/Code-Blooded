import { Router } from 'express';
import { getLeaderboard, getRewards, redeemReward, getSquads, joinSquad } from '../controllers/communityController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/leaderboard', getLeaderboard);
router.get('/rewards', getRewards);
router.post('/rewards/redeem', authenticateToken, redeemReward);
router.get('/squads', getSquads);
router.post('/squads/join', authenticateToken, joinSquad);

export default router;
