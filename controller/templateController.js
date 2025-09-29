import { templateData } from "../models/TemplateModel.js";

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

export const updateTemplate = async (req, res) => {
    const { id } = req.params;
    const { title, image, description, genre, Price } = req.body;
    try {
        const updatedTemplate = await templateData.findOneAndUpdate({
            _id: id
        }, {
            title,
            image,
            description,
            genre,
            Price,
        }, { new: true });
        
        res.status(200).json({
            success: true,
            message: "Template updated successfully",
            template: updatedTemplate
        });
    } catch (error) {
        console.log('Error updating template:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteTemplate = async (req, res) => {
    const { title } = req.params;
    try {
        const deletedTemplate = await templateData.findOneAndDelete({ title });
        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error('Error deleting template:', error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const searchTemplate = async (req, res) => {
    const { search } = req.query;
    try {
        const result = await templateData.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { genre: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        })
        res.status(200).json({ result });
    } catch (error) {
        console.log("error in the searching template", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}