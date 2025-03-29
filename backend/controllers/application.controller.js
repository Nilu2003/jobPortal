import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";

export const applyForJob = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, yearsOfExperience, jobId,userId} = req.body;
        // const userId = req.user?._id; 
        // Extract user ID from JWT (if authenticated user)

        // console.log( req.body);
        

        if (!fullname || !email || !phoneNumber || !yearsOfExperience || !jobId || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate Job ID and User ID
        if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid job ID or user ID" });
        }

        let resumeLocalPath = req.files?.resume?.[0]?.path;
        if (!resumeLocalPath) {
            return res.status(400).json({ message: "Resume is required" });
        }

       let resume;
        try {
            resume = await uploadOnClodinary(resumeLocalPath);
            if (!resume?.url) throw new Error("Cloudinary upload failed");
        } catch (error) {
            return res.status(500).json({ message: "Resume upload failed", error: error.message });
        }

        // console.log(resume.url);run dev

        

        const newApplication = new Application({
            userId,
            jobId,
            fullname,
            email,
            phoneNumber,
            yearsOfExperience,
            status: "pending",
            resume: resume.url || "",
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully", application: newApplication });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get All Applications (Admin view)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate("jobId").populate("userId");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Application by ID (Admin view)
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate("jobId").populate("userId");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Application Status (Admin action)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Application status updated", application: updatedApplication });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete Application (Admin action)
export const deleteApplication = async (req, res) => {
    try {
        const deletedApplication = await Application.findByIdAndDelete(req.params.id);

        if (!deletedApplication) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Get Applications by User (User Dashboard)
export const getApplicationsByUser = async (req, res) => {
    try {

        console.log("Request Params:", req.params.id);
        // console.log("Request Params:", req.user.id);

        const userId = req.params.id; // Assuming user ID is extracted from JWT token

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const applications = await Application.find({ userId })
            .populate({
                path: "jobId",
                select: "title companyName location", // Show relevant job details
            })
            .sort({ createdAt: -1 }); // Sort by latest application first

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





export const getApplicationsForRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
            return res.status(400).json({ message: "Invalid recruiter ID" });
        }

        // Find jobs created by this recruiter
        const recruiterJobs = await Job.find({ createdBy: recruiterId }).select("_id");

        if (recruiterJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this recruiter" });
        }

        const jobIds = recruiterJobs.map((job) => job._id);

        // Find applications for these jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate("jobId", "title companyName location")
            .populate("userId", "fullname email phoneNumber");

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


