import express from 'express';
import { authMe, searchUserByUsername, uploadAvatar } from '../controllers/userController.js';
import { upload } from '../middlewares/uploadMiddleWare.js';

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export default router;
