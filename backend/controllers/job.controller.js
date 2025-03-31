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
    const { id } = req.params;
    
    if (!id || id.length !== 24) {
        return res.status(400).json({ error: "Invalid job ID" });
    }

    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


// Update Job - Only recruiters can update jobs
export const updateJob = async (req, res) => {
    try {
        const { email, ...jobData } = req.body; 
        const user = await User.findOne({ email });

        if (!user || user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can update jobs" });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.createdBy.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own jobs" });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true });
        return res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.error("Update Job Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
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



export const searchJobs = async (req, res) => {
    try {
        const { query, location } = req.query;
        let filter = {};

        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { companyName: { $regex: query, $options: "i" } }
            ];
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        const jobs = await Job.find(filter);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error searching jobs", error: error.message });
    }
};




export const getJobsByRecruiter = async (req, res) => {
    try {
        const { email } = req.body; // Assuming email is sent in the request

        if (!email) {
            return res.status(400).json({ message: "Recruiter email is required" });
        }

        // Find recruiter by email
        const recruiter = await User.findOne({ email });

        if (!recruiter || recruiter.role !== "recruiter") {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Fetch only jobs created by this recruiter
        const jobs = await Job.find({ createdBy: recruiter._id });

        res.status(200).json({ jobs, count: jobs.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

