import express from "express";
import { upload } from "../middlewares/multer.js";
import { applyForJob, getAllApplications, getApplicationById, updateApplicationStatus, deleteApplication ,getApplicationsByUser, getApplicationsForRecruiter} from "../controllers/application.controller.js"
const router = express.Router();


router.route("/apply-job").post(
    upload.fields([
        {
            name:"resume",
            maxCount:1
        }
    ]),applyForJob);//user apply the job
router.route("/get-application").get(getAllApplications);//admin see all job application by the user
router.route("/get-application/:id").get( getApplicationById); //admin can see the specific  job by user apply
router.route("/get-application/:id").put(updateApplicationStatus);//admin update by status by user apply
router.route("/get-application/:id").delete(deleteApplication);//admin can delete application optional

router.get("/recruiter-applications/:recruiterId", getApplicationsForRecruiter);
router.route("/get-application-user/:id").get(getApplicationsByUser);

export default router;