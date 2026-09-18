import { Router } from 'express';
import { createListing, getListings } from '../controllers/listingController';
import { authenticateToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getListings);
router.post('/', authenticateToken, upload.single('image'), createListing);

export default router;
