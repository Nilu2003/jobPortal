import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";

// Apply for a Job (User applies for a job)
export const applyForJob = async (req, res) => {
    try {
        const { jobId, userId } = req.body;

        if (!jobId || !userId) {
            return res.status(400).json({ message: "Job ID and User ID are required" });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ message: "User has already applied for this job" });
        }

        // Check if resume is provided
        let resumeLocalPath = req.files?.resume?.[0]?.path;
        if (!resumeLocalPath) {
            return res.status(400).json({ message: "Resume is required" });
        }

        // Upload to Cloudinary
        let resume1;
        try {
            resume1 = await uploadOnClodinary(resumeLocalPath);
            if (!resume1?.url) throw new Error("Cloudinary upload failed");
        } catch (error) {
            return res.status(500).json({ message: "Resume upload failed", error: error.message });
        }

        // Create a new application
        const newApplication = new Application({
            jobId,
            userId,
            status: "pending",
            resume: resume1.url
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
