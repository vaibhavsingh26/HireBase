import express from "express";
import authenticate from '../middlewares/auth.js';
import { registerCompany , getCompany, getCompanyById, updateCompany } from '../controllers/company.controller.js';
const router = express.Router();
console.log("✅ company.route.js reached");
router.route('/register').post(authenticate, registerCompany);
router.route('/get').get(authenticate, getCompany);
router.route('/:id').get(authenticate, getCompanyById); 
router.route('/update/:id').put(authenticate, updateCompany); 



export default router;