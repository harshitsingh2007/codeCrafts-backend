import nodeMailer from 'nodemailer';

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
            html: `
                <h2>Please verify your email</h2>
                <p>Your verification code is: <strong>${verificationToken}</strong></p>
                <p>This code will expire in 24 hours.</p>
            `,
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
            html: `
                <h2>Password Reset Request</h2>
                <p>To reset your password, please use the following link:</p>
                <a href="https://code-crafts-frontend.vercel.app/reset-password?token=${resetToken}">Reset Password</a>
                <p>This link will expire in 1 hours.</p>
            `,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
}