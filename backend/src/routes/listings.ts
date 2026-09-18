import { Router } from 'express';
import { createListing, getListings, getListingById, claimItem } from '../controllers/listingController';
import { authenticateToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', getListings);
router.post('/', authenticateToken, upload.single('image'), createListing);
router.get('/:id', getListingById);
router.post('/:id/claim', authenticateToken, claimItem);

export default router;
