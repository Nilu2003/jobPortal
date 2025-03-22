import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, updateProfile } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const router=Router()
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-profile").post(verifyJWT,updateProfile);



export default  router