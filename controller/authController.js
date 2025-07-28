import { user } from "../models/userModels.js";
import bcrypt from 'bcrypt'

export const Signup =async (req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email||!password){
            return res.status(400).json({message: "Email and Password are required"});
        }
        const ifUserExists = await user.findOne({ email });

        if (ifUserExists) {
            alert("User already exists");
            return res.status(400).json(
                { message: "user already exists" }
            )
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 1000000).toString();
        const newUser = await user.create({
            email: email,
            password: hashedPassword,
            lastlogin: Date.now(),
            verificationToken
        });
        await newUser.save()
        
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
        const user=await user.findOne({ email });
        if(!user){
            return res.status(400).json({message: "invalid credential"});
        }
        const isPasswordVerified = await bcrypt.compare(password, user.password);
        if (isPasswordVerified) {
            return res.status(400).json({message:"invalid credential"})
        }
         
        user.lastlogin=Date.now()
        await user.save()
        res.status(200).json({
            message:"login successfull"
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Internal Server Error"});
    }
}
