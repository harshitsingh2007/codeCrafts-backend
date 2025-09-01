import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    Price:{
        type:Number,
        required:true,
    },
}, { timestamps: true });

export const templateData= mongoose.model("Template",templateSchema);