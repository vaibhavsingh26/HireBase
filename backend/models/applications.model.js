import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Rejected', 'Accepted'],
        default: 'Applied',
    },
    resume: {
        type: String,
        required: false, // Optional field for resume
    },
}, { timestamps: true });
export const Application = mongoose.model("Application", applicationSchema);