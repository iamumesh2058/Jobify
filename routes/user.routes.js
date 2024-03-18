import {Router } from "express";

import {
    getCurrentUser, 
    getApplicationStats, 
    updateUser
}  from "../controllers/user.controller.js";
import { validateUpdateUser } from "../middleware/validationMiddleware.js";
import { authorizePermissions, checkForTestUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();
router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats',[
    authorizePermissions('admin'), 
    getApplicationStats
]);
router.patch('/update-user', checkForTestUser, upload.single('avatar'), validateUpdateUser, updateUser);


export default router;