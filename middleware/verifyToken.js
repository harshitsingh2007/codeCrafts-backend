import jwt from "jsonwebtoken";

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
