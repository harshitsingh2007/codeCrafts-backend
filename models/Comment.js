import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    templateId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Template", 
    required: true 
  },
    userId: { type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
    },
    comment: { 
    type: String, 
    required: true },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);
