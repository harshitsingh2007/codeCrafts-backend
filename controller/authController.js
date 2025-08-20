import {User} from '../models/userModels.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateToken } from "../utils/generateToken.js";
import {sendEmailVerification} from '../mailTrap/email.js'

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

export const forgotPassword=async(req,res)=>{
    const {email} = req.body;
    try {
    const user= await User.findOne({email})
    if(!user){
        res.status(400).json({
            success:false,
            message:"user not founded",
        })
    }
    const resetToken=crypto.randomBytes(30).toString("hex")
    const resetTokenExpires=1*60*60*1000

    user.resetpassword=resetToken,
    user.resetpasswordExpiery=resetTokenExpires

    await user.save()

    //nodemailer
    await sendEmailVerification(user.email, resetToken);

    res.status(201).json({
        message:"forgot password link sended",
    }) 
     }catch (error) {
        console.log(error.message,"internal server error")
        res.status(500).json({
            message:"internal server error"
        }) 
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

export const resetpassword = async(req,res)=>{
   const {token}=req.params;
   const {password}=req.body;
    try {
        const user = await User.findOne({
            resetpassword: token,
            resetpasswordExpiery: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetpassword = undefined;
        user.resetpasswordExpiery = undefined;

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
}

