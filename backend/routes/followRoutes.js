import express from 'express';
import { 
  sendFollowRequest, 
  acceptFollowRequest, 
  rejectFollowRequest, 
  unfollowUser, 
  getFollowRequests, 
  getFollowers, 
  getFollowing 
} from '../controllers/followController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/:userId', sendFollowRequest);
router.patch('/:requestId/accept', acceptFollowRequest);
router.patch('/:requestId/reject', rejectFollowRequest);
router.delete('/:userId', unfollowUser);
router.get('/requests', getFollowRequests);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

export default router;