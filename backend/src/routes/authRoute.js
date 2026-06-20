import express from 'express';
import { refreshToken, signIn, signOut, signUp, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.post("/refresh", refreshToken);

router.get("/verify/:token", verifyEmail);

export default router;