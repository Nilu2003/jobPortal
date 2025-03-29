import { Router } from "express";
import { verifyJWT } from "../middlewares/isAuth.js";
import { registerJob, getAllJobs, getJobById, updateJob, deleteJob, searchJobs, getJobsByRecruiter } from "../controllers/job.controller.js";
import { upload } from "../middlewares/multer.js";


const router=Router();

router.route("/register-job").post(
    upload.fields([
        {
            name:"logo",
            maxCount:1
        }
    ]),registerJob); //adamin regiset job
router.route("/getjob").get(getAllJobs);//user see all the job
router.route("/getjob/:id").get(getJobById);//user specific get job
router.route("/getjob/:id").put(updateJob);//admin can update the job
router.route("/getjob/:id").delete(deleteJob);// admin can delete the job
router.get("/search",  searchJobs);
router.post("/jobs/recruiter", getJobsByRecruiter);



export default router