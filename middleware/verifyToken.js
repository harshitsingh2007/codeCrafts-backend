import jwt from 'jsonwebtoken'

export const verifyToken = (req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }
    try {
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: "Unauthorized"});
        }
        req.user = decoded.userId;
        next();

    } catch (error) {
        console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
    }

}

