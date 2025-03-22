
import mongoose from "mongoose";


const userSchema =  new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phoneNumber: {
        type: Number,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    skills: [{
        type: String,

    }],
    role:{
        type:String,
        enum:["student","recruiter"],
        require:true
    },
    refreshToken: {
        type:String,
    },
    ApplicationID:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Application"
    }]
},{timestamps:true})

export const User=mongoose.model("User",userSchema);