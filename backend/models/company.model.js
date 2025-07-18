import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
    },
    logo: {
        type: String,
        default: "",
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    employees: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{ timestamps: true });
 const Company = mongoose.model("Company", companySchema);
 export { Company };
 

