import nodeMailer from 'nodemailer';
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure:true,
    host: 'smtp.gmail.com',
    port:465,
    auth: {
        user:"harshit2313.2007@gmail.com",
        pass:"lfelabxxbfvqdosy"
    }
});

const sender = 'harshit2313.2007@gmail.com';

export const sendEmailVerification = async (email, verificationToken) => {
    try {
        const info = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Email Verification",
            html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
}

export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const info = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Request",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', `http://localhost:3000/reset-password?token=${resetToken}`),
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
}