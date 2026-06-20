import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

export const sendVerificationEmail = async (email, token) => {
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
        const verifyLink = `${backendUrl}/api/auth/verify/${token}`;

        const mailOptions = {
            from: '"ChatChit App" <no-reply@chatchit.com>',
            to: email,
            subject: 'Xác nhận địa chỉ email của bạn - ChatChit',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Chào mừng bạn đến với ChatChit!</h2>
                    <p>Cảm ơn bạn đã đăng kí tài khoản. Vui lòng bấm vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác nhận Email</a>
                    </div>
                    <p>Hoặc bạn có thể copy và dán đường link này vào trình duyệt:</p>
                    <p><a href="${verifyLink}">${verifyLink}</a></p>
                    <p>Link này sẽ hết hạn sau một thời gian, vui lòng xác nhận sớm.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận:", error);
        return false;
    }
};
