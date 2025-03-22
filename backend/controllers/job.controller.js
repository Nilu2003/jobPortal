import { error, log } from "console";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";

// Register a Job - Only recruiters can create a job
export const registerJob = async (req, res) => {
    try {
        const { title, description, salary, jobType, location, companyName, email } = req.body;

        if (!title || !description || !salary || !jobType || !location || !companyName || !email) {
            return res.status(400).json({ message: "All fields are required" ,error:error});
        }

        // console.log(req.body);
        

        

        const user = await User.findOne({ email });
        console.log(user._id);
        


        if (!user || user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can create jobs" });
        }

        let logoUrl = null;

        // Handle Logo Upload (if provided)
        if (req.files?.logo?.[0]?.path) {
            const logoLocalPath = req.files.logo[0].path;

            try {
                const logoUpload = await uploadOnClodinary(logoLocalPath);
                if (!logoUpload?.url) {
                    throw new Error("Cloudinary upload failed");
                }
                logoUrl = logoUpload.url;
            } catch (error) {
                return res.status(500).json({ message: "Logo upload failed", error: error.message });
            }
        }

        // Create Job Entry
        const newJob = new Job({
            title,
            description,
            salary,
            jobType,
            location,
            companyName,
            createdBy: user._id,
            logo: logoUrl || " ",
        });

        await newJob.save();
        res.status(201).json({ message: "Job registered successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get All Jobs - Available for all users
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ jobs, count: jobs.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Job by ID
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Job - Only recruiters can update jobs
export const updateJob = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can update jobs" });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Job - Only recruiters can delete jobs
export const deleteJob = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can delete jobs" });
        }

        const deletedJob = await Job.findByIdAndDelete(req.params.id);

        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
