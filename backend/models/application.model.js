import mongoose from "mongoose";

const applicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    resume:{
        type:String,
        require:true,
    }
},{timestamps:true})

export const Application=mongoose.model("Application",applicationSchema);