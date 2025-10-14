import { templateData } from "../models/TemplateModel.js";
import jwt from 'jsonwebtoken';
import { Comment } from "../models/Comment.js";
import dotenv from 'dotenv'
dotenv.config()

export const getAlltemplate = async (req, res) => {
    try {
        const templates = await templateData.find();
        res.status(200).json({ templates });
    } catch (error) {
        console.error('Error fetching templates:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addTemplate = async (req, res) => {
  try {
    const { title, description, genre, Price, image } = req.body;
    
    if (!image) {
        return res.status(400).json({ success: false, message: "Image URL is required" });
    }

     const newTemplate = new templateData({
      title,
      description,
      genre,
      Price,
      image: image,
      OwnerId:req.user
    });

    await newTemplate.save();

    res.status(201).json({
      success: true,
      message: "Template added successfully",
      template: newTemplate,
    });

  } catch (error) {
    console.error("Error adding template:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOwnerTemplate = async (req, res) => {
    try {
        const templates = await templateData.find({ OwnerId: req.user });
        res.status(200).json({ templates });
    } catch (error) {
        console.log("Error in fetching owner templates:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const removeOwnerTemplate=async(req,res)=>{
  try {
    const {id}=req.body;
    if(!id){
      return res.status(400).json({message:"Template id is required"})
    }
    const result=await templateData.deleteOne({_id:id,OwnerId:req.user});
    if(result.deletedCount===0){
      return res.status(404).json({message:"Template not found or you are not authorized to delete this template"})
    }
    res.status(200).json({message:"Template deleted successfully"})
  } catch (error) {
    console.log("Error in deleting owner template:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const CommnetOnTemplate = async (req, res) => {
  try {
    const { id } = req.params; 
    const { comment } = req.body;
    const userId = req.user; 

    const template = await templateData.findById(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    const newComment = await Comment.create({
      templateId: id,
      userId,
      comment,
    });
    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getCommentsOnTemplate=async(req,res)=>{
  try {
    const {id}=req.params;
    const comment=await Comment.find({templateId:id}).populate('userId','name email');
    res.status(200).json({comment})
  } catch (error) {
    console.log("no comments found",error)
    res.status(500).json({message:"internal server error"})
  }
}


export const saveTemplate=async(req,res)=>{
  try {
    const {id}=req.params;
    const userId=req.user;
    const template=await templateData.findById(id);
    if(!template){
      return res.status(404).json({message:"template not found"})
    }
    if(template.SavedBy.includes(userId)){
      return res.status(400).json({message:"template already saved"})
    }
    template.SavedBy.push(userId);
    await template.save();
    res.status(200).json({message:"template saved successfully",template})
  } catch (error) {
    console.log("no template saveable found",error)
    res.status(500).json({message:"internal server error"})
  }
}

export const getsavedTemplates=async(req,res)=>{
  try {
    const userid=req.user;
    const template=await templateData.find({SavedBy:userid});
    res.status(200).json({template})
  } catch (error) {
    console.log("no saved templates found",error)
    res.status(500).json({message:"internal server error"})
  }
}

export const deleteSavedTemplate = async (req, res) => {
  try {
    const userId = req.user;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const result = await templateData.updateOne(
      { _id: id },
      { $pull: { SavedBy: userId } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Template not found or not saved by user" });
    }

    return res.status(200).json({ message: "Template removed from saved items" });
  } catch (error) {
    console.error("Error in deleting saved template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

