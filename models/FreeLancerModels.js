import mongoose from "mongoose";

const FreeLancerschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    Image:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:Number,
        required:true,
    },
    Location:{
        type:String,
        required:true,
    },
    Language:{
       type:[String], 
        required:true,
    }
    
})
export const FreeLancerModel=mongoose.model("freelancer",FreeLancerschema);