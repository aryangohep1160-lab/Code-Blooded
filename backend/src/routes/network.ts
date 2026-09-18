import { Router } from 'express';
import { getPartners } from '../controllers/networkController';

const router = Router();

router.get('/partners', getPartners);

export default router;
