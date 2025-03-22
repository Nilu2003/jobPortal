import express from "express";
import userRoute from "./Routes/user.route.js";
import jobRoute from "./Routes/job.route.js";
import applicationRoute from "./Routes/application.route.js"
import cookieparser from "cookie-parser";
import cors from "cors";
const app =express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieparser());


app.use("/api/v1/user",userRoute)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationRoute)
export {app};


