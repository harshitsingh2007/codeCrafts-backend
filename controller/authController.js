import {User} from '../models/userModels.js'
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/generateToken.js";

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
            email: email,
            password: hashedPassword,
            lastlogin: Date.now(),
            verificationToken,
            varificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, 
        });

         await newUser.save();
        generateToken(res, newUser._id);

        res.status(201).json({
            message: "user created succesfully",
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal Server Error"});
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