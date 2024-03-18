import { Router } from "express";
const router = Router();

import {
    register,
    login,
    logout
} from "../controllers/auth.controller.js";

import { validateRegisterInput } from "../middleware/validationMiddleware.js";

router.post('/register', validateRegisterInput, register);
router.post('/login', login);
router.get("/logout", logout);


export default router;