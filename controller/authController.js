import {User} from '../models/userModels.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateToken } from "../utils/generateToken.js";
import {sendEmailVerification, sendPasswordResetEmail} from '../mailTrap/email.js'

export const Signup =async (req,res)=>{
    const {email,password,name,Identity}=req.body;
    try {
        if(!email||!password || !name || !Identity){
            return res.status(400).json({message: "Email and Password are required"});
        }
        const ifUserExists = await User.findOne({ email });

        if (ifUserExists) {
            return res.status(400).json(
                { message: "user already exists" }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const varificationToken= Math.floor(100000 + Math.random() * 1000000).toString();

        const newUser = await User.create({
            name:name,
            email:email,
            password: hashedPassword,
            Identity:Identity,
            lastlogin: Date.now(),
            varificationToken,
            varificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
        });

        generateToken(res, newUser._id);

        //jwt
        await sendEmailVerification(newUser.email,varificationToken)

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message
        });
    }
}


export const Login =async (req,res)=>{
    const {email,password}=req.body;
    try {
        const userexits = await User.findOne({ email });
        if(!userexits){
            return res.status(400).json({message: "invalid credential"});
        }
        const isPasswordVerified = await bcrypt.compare(password, userexits.password);
        
        if (!isPasswordVerified) {
            return res.status(400).json({message:"invalid credential"});
        }
        generateToken(res, userexits._id);
        await userexits.save();
        res.status(200).json({
            message:"login successfull"
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "logout succesfull",
    });
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            varificationToken: code,
            varificationTokenExpiry: { $gt: Date.now() }
        });
    
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid or expired code" 
            });
        }
        
        user.isVerified = true;
        user.varificationToken = undefined;
        user.varificationTokenExpiry = undefined;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "User verified successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const checkAuth = async(req,res)=>{
    try {
        const user=await user.findById(req.user._id).select("-password -__v");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        console.log("checkAuth error:", error.message);
        res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        
        const resetTokens = crypto.randomBytes(30).toString("hex");
        const resetTokenExpire = Date.now() + 1 * 60 * 60 * 1000;

        
        user.resetToken = resetTokens;
        user.resetTokenExpires = resetTokenExpire;

        await user.save();

       
        await sendPasswordResetEmail(user.email, resetTokens);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.log(error.message, "internal server error");
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    
    try {
        const user = await User.findOne({
            resetToken: token, 
            resetTokenExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        
        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined; 
        user.resetTokenExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};