import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies?.token; 
        

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }

        req.user = decoded.userId; 
        next(); 
    } catch (error) {
        console.error("Error in verifyToken:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export const verifyAdmin=(req,res,next)=>{
    try {
        if(req.user.role!=="admin"){
            return res.status(403).json({message:"Forbidden, admin access required"})
        }
        next()
    } catch (error) {
        console.error("Error in verifyAdmin:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}