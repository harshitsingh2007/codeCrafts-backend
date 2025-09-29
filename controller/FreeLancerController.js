import { FreeLancerModel } from "../models/FreeLancerModels.js";
import { User } from "../models/userModels.js";

export const fetchAllFreelancer = async (req, res) => {
    try {
        const freelancers = await FreeLancerModel.find();
        res.status(200).json({
            success: true,
            data: freelancers
        });
    } catch (error) {
        console.log("fetchAllFreelancer error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const CreateFreeLancer = async (req, res) => {
    const { name, email, skills, about, phoneNo, Location, Language, role, Image } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: "Name is required."
        });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required."
        });
    }

    if (!role || !role.trim()) {
        return res.status(400).json({
            success: false,
            message: "Role is required."
        });
    }

  
    if (!Image || !Image.startsWith('http')) {
        return res.status(400).json({
            success: false,
            message: "Valid image URL is required."
        });
    }

    try {
        const existingFreelancer = await FreeLancerModel.findOne({ email });
        if (existingFreelancer) {
            return res.status(400).json({
                success: false,
                message: "Freelancer with this email already exists."
            });
        }

        const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);
        const languageArray = Array.isArray(Language) ? Language : (Language ? [Language] : []);

        const newFreeLancer = await FreeLancerModel.create({
            name: name.trim(),
            email: email.trim(),
            skills: skillsArray,
            about: about || "",
            phoneNo: phoneNo || "",
            Location: Location || "",
            Language: languageArray,
            role: role.trim(),
            Image: Image
        });

        const user = await User.findOne({ email: email.trim() });
        if (user) {
            user.isFreeLancer = true;
            user.FreelancerId = newFreeLancer._id;
            await user.save();
        }

        console.log("Freelancer created successfully:", newFreeLancer._id);

        res.status(201).json({
            success: true,
            message: "Freelancer profile created successfully",
            data: newFreeLancer
        });
    } catch (error) {
        console.log("CreateFreeLancer error:", error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Freelancer with this email already exists."
            });
        }
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        });
    }
};