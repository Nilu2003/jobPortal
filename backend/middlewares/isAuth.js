import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async(req,res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token Received:", token);
        
        // console.log(token);
        if (!token) {
            return res.status(401).json({
                message:"Unauthorized request",
                success:false
            })
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(401).json({
                message:"Invalid access Token",
                success:false
            })
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log(error);
        
        return res.status(401).json({
            message:"invalid access token",
            success:false,
        })
    }
    
}