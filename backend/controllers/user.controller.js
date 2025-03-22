import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnClodinary } from "../utils/cloudinary.js";



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
        );
        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
        );

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        console.log(error);

    }
}

const registerUser = async (req, res) => {
    try {
        let { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                sucess: false,
            })
        }
        // console.log(req.body);




        const user = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        })
        if (user) {
            return res.status(400).json({
                message: "user email or phonenumber alerady register",
                sucess: "false"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);

        // let resumeLocalPath=req.files?.resume[0]?.path;
        // if(!resumeLocalPath){
        //     return res.status(400).json({
        //         message:"resume is require",
        //         success:false
        //     })
        // }
        

        // const resume=await uploadOnClodinary(resumeLocalPath);

        // if(!resume){
        //     return res.status(400).json({
        //         message:"resume is require",
        //         success:false
        //     })
        // }

        await User.create({
            fullname,
            email,
            phoneNumber,
            role,
            password: hashpassword,
            // resume:resume?.url || ""


        })


        // console.log(role);




        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: "user register error",
            sucess: false
        })

    }




}


const loginUser = async (req, res) => {
    try {



        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
            })
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: "email not register",
                success: false
            })
        }

        let isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "password incorrect",
                success: false
            })
        }
        // console.log(user.role);

        if (role !== user.role) {
            return res.status(400).json({
                message: "current role is incoorect for this user",
                success: false

            })

        }





        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);


        // const createdUser = await User.findById(user._id).select(
        //     "-password -refreshToken"
        // )

        // const app= await User.findById(user._id);
        // console.log(app);
        

        // if (!createdUser) {
        //     return res.status(500).json({
        //         message: "Something went wrong while registering the user",
        //         success: false
        //     })
        // }

        // console.log(createdUser);


        // const loggedInUser = await User.findById(user._id).select("-password -refreshToken");



        const options = {
            httpOnly: true,
            secure: true
        }


        user = {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
            role: user.role,
        }


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: `welcom back ${user.fullname}`,
                user,
                sucess: true
            })
    } catch (error) {
        console.log(error);

        res.status(400).json({
            message: "login error",
            error,
            sucess: false
        })
    }

}

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "logout sucessufully",
            sucess: "true"
        })
}


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                message: "access Token refreshed",
                data: { accessToken, refreshToken: newRefreshToken },
                success: false
            })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "invalid refresh token",
            success: "false"
        })

    }

}



const updateProfile = async (req,res) => {
    try {
        const { fullname, email, phoneNumber, skills } = req.body;

        if(!email && !phoneNumber && !phoneNumber && !skills && !fullname){
            return res.status(401).json({
                message:"plese enter emai or phone number or phone number",
                success:false,
            })
        }

       const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
                phoneNumber,
                skills

            }
        },
        {new:true}
    ).select("-password") 


    
    

        // let user = await User.findOne({email});
         

        // // console.log(user);
        // if (fullname) {
        //     user.fullname
        // }

        // if (phoneNumber) {
        //     user.phoneNumber
        // }

        // if (email) {
        //     user.email
        // }

        // if (skills) {
        //     user.skills
        // }

        // await user.save();

        // user={
        //     _id:user._id,
        //     fullname:user.fullname,
        //     email:user.email,
        //     phoneNumber:user.phoneNumber,
        //     role:user.role,
        //     profile:user.profile

        // }




        return res.status(200).json({
            message: "Account details updated successfully",
            user,
            success: true
        })



    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "update unsucessfully error",
            success: false
        })

    }
}












export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateProfile
}