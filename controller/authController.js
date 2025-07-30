import {User} from '../models/userModels.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { generateToken } from "../utils/generateToken.js";
import {sendEmailVerification} from '../mailTrap/email.js'
export const Signup =async (req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email||!password){
            return res.status(400).json({message: "Email and Password are required"});
        }
        const ifUserExists = await User.findOne({ email });

        if (ifUserExists) {
            return res.status(400).json(
                { message: "user already exists" }
            )
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 1000000).toString();
        const newUser = await User.create({
            email,
            password: hashedPassword,
            lastlogin: Date.now(),
            verificationToken, 
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        });

        generateToken(res, newUser._id);
        await sendEmailVerification(newUser.email,verificationToken);

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

export const verifyEmail=async (req,res)=>{
    const {code}=req.body;
    try {
        const user= await User.findOne({
            varificationToken:code,
            varificationTokenExpiry:{$gt:Date.now()}
        })

        if (!user) {
             return res.status(400).json({
                message: "Invalid or expired verification token"
        })
    } 
       user.isVerified=true;
       user.varificationToken=undefined,
       user.varificationTokenExpiry=undefined,
        
       user.save();

       res.status(200).json({
        message:"email varification done"
       })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Internal Server Error"});
    }
}



export const forgotPassword=async(req,res)=>{
    const {email} = req.body;

    try {
    const user=User.findOne({email})
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


