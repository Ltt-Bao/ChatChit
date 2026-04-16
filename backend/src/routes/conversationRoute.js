import express from 'express';
import {
    createConversation,
    getConversations,
    getMessage
} from '../controllers/conversationController.js';
import { checkFriendShip } from '../middlewares/friendMiddleWare.js';

const router = express.Router();

router.post("/", checkFriendShip, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/message", getMessage);

export default router;