import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js"; 
import jobRoute from "./routes/job.route.js";
import companyRoute from "./routes/company.route.js";
import applicationsRoute from "./routes/applications.route.js";



const app = express();


const MONGO_URI = "mongodb+srv://vaibsingh0:6EH8azrCaVYiF86X@cluster0.1zb75wi.mongodb.net/JOBP?retryWrites=true&w=majority";
console.log("🔗 Connecting to MongoDB URI:", MONGO_URI);



mongoose.connect(MONGO_URI)

.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Test route
app.use("/api/v1/user",userRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/applications",applicationsRoute);



// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

