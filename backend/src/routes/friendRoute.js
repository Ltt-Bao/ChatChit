import express from 'express';

import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getAllFriend,
    getAllFriendRequest
} from '../controllers/friendController.js';

const router = express.Router();

router.post("/requests", sendFriendRequest);

router.post("/requests/:requestId/accept", acceptFriendRequest);

router.post("/requests/:requestId/decline", declineFriendRequest);

router.get("/", getAllFriend);

router.get("/requests", getAllFriendRequest);

export default router

