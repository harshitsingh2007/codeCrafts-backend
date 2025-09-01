import { FreeLancerModel } from "../models/FreeLancerModels.js";

export const fetchAllFreelancer=async(req,res)=>{
    try {
        const freelancers=await FreeLancerModel.find();
        res.status(200).json({
            success:true,
            data:freelancers
        })
    } catch (error) {
        console.log("fetchAllFreelancer error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
export const CreateFreeLancer=async(req,res)=>{
    const {name,email,skills,about,phoneNo,Location,Language,role,Image}=req.body;
    try {
        const newFreeLancer=await FreeLancerModel.create({
            name,
            email,
            skills,
            about,
            phoneNo,
            Location,
            Language,
            role,
            Image
        });
        await newFreeLancer.save();
        res.status(201).json({
            success:true,
            message:"FreeLancer profile created successfully",
            data:newFreeLancer
        });
    } catch (error) {
        console.log("CreateFreeLancer error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const updateFreeLancer=async(req,res)=>{
    const {id}=req.params;
    const {name,email,skills,about,phoneNo,Location,Language,role,Image}=req.body;
    try {
        const updatedFreeLancer=await FreeLancerModel.findByIdAndUpdate(
            id,
            {
                name,
                email,
                skills,
                about,
                phoneNo,
                Location,
                Language,
                role,
                Image
            },
            {new:true}
        );
        if(!updatedFreeLancer){
            return res.status(404).json({
                success:false,
                message:"FreeLancer not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"FreeLancer profile updated successfully",
            data:updatedFreeLancer
        });
    } catch (error) {
        console.log("updateFreeLancer error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const deleteFreeLancer=async(req,res)=>{
    const {id}=req.params;
    try {
        const deletedFreeLancer=await FreeLancerModel.findByIdAndDelete(id);
        if(!deletedFreeLancer){
            return res.status(404).json({
                success:false,
                message:"FreeLancer not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"FreeLancer profile deleted successfully",
            data:deletedFreeLancer
        });
    } catch (error) {
        console.log("deleteFreeLancer error:", error.message);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
