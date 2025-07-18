
import { Application } from "../models/applications.model.js";
import { Job } from "../models/job.model.js";


export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
            console.log("📥 userId:", userId);
    console.log("📥 jobId:", jobId);
        if(!jobId) {
            return res.status(400).json({ message: "Job ID is required", success: false });
        }   
        const existingApplication = await Application.findOne({ applicant: userId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }  
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({ message: "Job application submitted successfully", success: true, application: newApplication });

    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const getApplications = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).populate('job');
        if (!applications) {
            return res.status(404).json({ message: "No applications found", success: false });
        }
        return res.status(200).json({ message: "Applications fetched successfully", success: true, applications });

    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: 'applications',
      populate: {
        path: 'applicants',
        select: 'fullname email phoneNumber'}
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({
      message: "Applicants fetched successfully",
      success: true,
      applicants: job.applications,
    });

  } catch (error) {
    console.error("❌ Error fetching applicants:", error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateStatus = async (req, res) => {
    try {
        const {status } = req.body;
        const applicationId = req.params.id;
        if (!applicationId || !status) {
            return res.status(400).json({ message: "Application ID and status are required", success: false });
        }
        const application=await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false });
        }
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({ message: "Application status updated successfully", success: true, application });
    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
