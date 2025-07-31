import { templateData } from "../models/TemplateModel.js";

export const getAlltemplate= async (req, res) => {
    try {
        const templates = await templateData.find();
        res.status(200).json({ templates });
    } catch (error) {
        console.error('Error fetching templates:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const addTemplate=async(req,res)=>{
    const { title, image, description, genre, createdBy } = req.body;
    try {
        const newTemplate = new templateData({
            title,
            image,
            description,
            genre,
            createdBy,
        });
        await newTemplate.save();
        res.status(201).json({ template: newTemplate });
    } catch (error) {
        console.error('Error adding template:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateTemplate=async(req,res)=>{
    const {id}=req.params;
    const {title,image,description,genre}=req.body;
    try {
        const res=await templateData.findOneAndUpdate({
            _id:id
        },{
            title,
            image,
            description,
            genre,
        })
    } catch (error) {
        console.log('Error updating template:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteTemplate=async(req,res)=>{
    const  {title}=req.params;
    try {
        const deletedTemplate = await templateData.findOneAndDelete({title});
        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error('Error deleting template:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
