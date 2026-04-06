import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m'; // dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 *1000 // 14 ngày

export const signUp = async (req, res) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;
        //kiểm tra tồn tại
        if(!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({message: "Không thể thiếu username, password, email, firstName hoặc lastName"});
        }
        // kiểm tra username đã tồn tại chưa
        const duplicate = await User.findOne({username});

        if(duplicate) {
            return res.status(409).json({message: "Username đã tồn tại"});
        }

        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // số 10 là salt rounds, càng cao thì càng an toàn nhưng cũng tốn thời gian hơn

        // tạo user mới
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        // return
        return res.sendStatus(204);
    } catch (error) {
        console.error("Lỗi khi gọi signUp", error);
        res.status(500).json({message: "Lỗi máy chủ"});
    }
}

export const signIn = async (req, res) => {
    try {
        //lấy input
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({message: "Thiếu username hoặc password"});
        }

        //lấy hashedPassword
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message: "username hoặc password không chính xác"});
        }
        
        //kiểm tra passowrd

        const passWordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if(!passWordCorrect){
            return res.status(401).json({message: "username password nhập không chính xác"});
        }
        // nếu khớp tạo access token với JWT
        const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})


        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        // tạo session mới để lưu refresh token
        await Session.create({
            userID: user._id,
            refreshToken,
            expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        })

        // trả refresh token về trong res
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //backend và frontend deploy riêng, nếu chung để là strict
            maxAge: REFRESH_TOKEN_TTL
        });
        
        // trả access token về trong res

        return res.status(200).json({message: `User ${user.displayName} đã logged in`, accessToken})
    } catch (error) {
        console.error("Lỗi khi gọi signin", error);
        return req.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const signOut = async (req, res) => {
    try {
        //lấy rf token từ cookie
        const token = req.cookies?.refreshToken;

        if(token){
            //xóa rf token trong session
            await Session.deleteOne({refreshToken : token});
            //xóa cookie
            res.clearCookie("refreshToken");
            return res.status(204);
        }
        
    } catch (error) {
        console.error("Lỗi khi đăng xuất", error)
        return res.status(500).json({message: "Lỗi hệ thống"})
    }
}