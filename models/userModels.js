import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        unique:true,
    },
    password:{
        type:String,
    },
    lastLogin:{
        type:Date,
        default: Date.now(),
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isadmin:{
        type :Boolean,
    },
    Identity:{
        type:String,
    },
    isFreeLancer:{
        type:Boolean,
        // default:false,
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
