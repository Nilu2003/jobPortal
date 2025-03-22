import mongoose, { Mongoose } from "mongoose";
import { dbName } from "../constants.js";


const connectDB= async () => {
    try {
        const connectionInstance=mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`,{
        });
        console.log(`MongoDB connected !! DB Host  `);
        // : ${connectionInstance.connection.host}
    } catch (error) {
        console.log("mongoDB connection failed",error);
        
    }
    

}

export default connectDB;