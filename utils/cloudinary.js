import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadONCloudinary = async (filePath) =>  {
    try {
        if(!filePath) return null;
        const result =await cloudinary.uploader.upload(filePath,{
            resource_type:"auto",        
        })
        fs.unlinkSync(filePath);
        return result;       
    } catch (error) {
        console.log("error while uploading on cloudinary",error);
         return null;  
    }
}
export {uploadONCloudinary};

   