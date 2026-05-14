import express from 'express';
import { authMe, searchUserByUsername, test } from '../controllers/userController.js';

const router = express.Router();

router.get("/me", authMe);
router.get("/get", searchUserByUsername)

export default router;
