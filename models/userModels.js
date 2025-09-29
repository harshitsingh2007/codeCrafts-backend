import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
    lastLogin:{
        type:Date,
        default: Date.now(),
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    Identity:{
        type:String,
        required:true,
    },
    isFreeLancer:{
        type:Boolean,
        default:false,
    },
    FreelancerId:{
        type:String,
    },
    googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
    }, 
    varificationToken:String,
    varificationTokenExpiry:Date,
    resetToken:String,
    resetTokenExpires:Date,
},{timestamps:true});

export const User = mongoose.model('User', userSchema);
