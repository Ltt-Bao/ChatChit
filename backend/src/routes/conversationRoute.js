import express from 'express';
import {
    createConversation,
    getConversations,
    getMessage,
    MarkAsSeen
} from '../controllers/conversationController.js';
import { checkFriendShip } from '../middlewares/friendMiddleWare.js';

const router = express.Router();

router.post("/", checkFriendShip, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", getMessage);
router.patch("/:conversationId/seen", MarkAsSeen);

export default router;