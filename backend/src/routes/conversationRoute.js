import express from 'express';
import {
    createConversation,
    getConversations,
    getMessage,
    markAsSeen,
    addMembers,
    removeMember,
    deleteConversation,
} from '../controllers/conversationController.js';
import { checkFriendShip } from '../middlewares/friendMiddleWare.js';

const router = express.Router();

router.post("/", checkFriendShip, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", getMessage);
router.patch("/:conversationId/seen", markAsSeen);
router.post("/:conversationId/members", addMembers);
router.delete("/:conversationId/members/:memberId", removeMember);
router.delete("/:conversationId", deleteConversation);

export default router;