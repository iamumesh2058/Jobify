import { Router } from 'express';
const router = Router();

import {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob,
    showStats
} from "../controllers/job.controller.js";

import {
    validateJobInput,
    validateIdParam
} from "../middleware/validationMiddleware.js";

import { checkForTestUser } from '../middleware/authMiddleware.js';

router.post("/createjob", checkForTestUser, validateJobInput, createJob);
router.get("/getalljobs", getAllJobs);

router.route('/stats').get(showStats);

router.get("/getsinglejob/:id", validateIdParam, getSingleJob);
router.put("/updatejob/:id", checkForTestUser, validateIdParam, validateJobInput, updateJob);
router.delete("/deletejob/:id", checkForTestUser, validateIdParam, deleteJob);


export default router;