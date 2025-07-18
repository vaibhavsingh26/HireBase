import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    console.log("✅ POST /api/v1/job/post HIT");
    try {
        const { title, description,requirements, companyId, location, salary,jobType,experience,position } = req.body;
        const userId = req.id;

      
        if (!title || !description || !companyId || !location || !salary || !requirements || !jobType || !experience || !position) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

      
        const job =  await Job.create({
            title,
            description,
            company: companyId,
            location,
            salary,
            requirements: requirements.split(','),
            experience,
            jobType,
            position,
            created_by: userId,
           
        });

       
        return res.status(201).json({ message: "Job posted successfully", success: true, job });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const getJobs = async (req, res) => {
    try {
        const keywords = req.query.keywords || '';

       const query = {
            $or: [
                { title: { $regex: keywords, $options: 'i' } },
                { description: { $regex: keywords, $options: 'i' } },
                { location: { $regex: keywords, $options: 'i' } },
                { companyId: { $regex: keywords, $options: 'i' } }
            ]
        };
        const jobs = await Job.find(query).populate({path:"company"}).sort({ createdAt: -1 });
        if(!jobs){
            return res.status(404).json({ message: "No jobs found", success: false });
        }
           
        return res.status(200).json({ message: "Jobs fetched successfully", success: true, jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        return res.status(200).json({ message: "Job fetched successfully", success: true, job });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId= req.id;
        const jobs = await Job.find({ created_by: adminId });
        if (!jobs) {
            return res.status(404).json({ message: "No jobs found for this admin", success: false });
        }
        return res.status(200).json({ message: "Admin jobs fetched successfully", success: true, jobs });
    } catch (error) {
        console.error("Error fetching admin jobs:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}