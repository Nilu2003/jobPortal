import mongoose from "mongoose";

const jobSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    
    createdBY:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    logo:{
        type:String,
        required:true,
    }

},
{timestamps:true}
)


export const Job=mongoose.model("Job",jobSchema)