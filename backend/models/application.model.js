import mongoose from "mongoose";

const applicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job", 
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
    fullname:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,

    },
    phoneNumber:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    resume:{
        type:String,
        required:true,
    },
    yearsOfExperience:{
        type:String,
        required:true,
    }
},{timestamps:true})

export const Application=mongoose.model("Application",applicationSchema);