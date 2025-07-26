import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
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
        default: Date.now,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
},{timestamps:true});

export const user=mongoose.model('User',userSchema);