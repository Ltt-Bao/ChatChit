import express from 'express';

import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getAllFriend,
    getAllFriendRequest
} from '../controllers/friendController.js';

const router = express.Router();

router.post("/request", sendFriendRequest);

router.post("/request/:requestId/accept", acceptFriendRequest);

router.post("/request/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriend);

router.get("/request", getAllFriendRequest);

export default router

