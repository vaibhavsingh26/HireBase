import express from "express";
import { postJob, getJobs, getJobById, getAdminJobs } from '../controllers/job.controller.js';
import authenticate from '../middlewares/auth.js';  
const router = express.Router();
console.log("✅ job.route.js reached");
router.route('/post').post( authenticate,postJob);
router.route('/get').get(getJobs);
router.route('/getAdmin').get(authenticate, getAdminJobs);
router.route('/:id').get(getJobById);


export default router;