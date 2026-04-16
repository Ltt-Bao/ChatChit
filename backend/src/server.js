import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import dns from 'dns';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import { protectedRoute } from './middlewares/authMiddleWare.js';
import cors from 'cors';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = express();
const PORT = process.env.PORT || 5001;

//middleware
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json());
app.use(cookieParser());


// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/message', messageRoute);
app.use('/api/conversations', conversationRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    })
});

