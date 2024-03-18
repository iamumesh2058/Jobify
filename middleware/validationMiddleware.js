import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/customError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constant.js";
import Job from '../models/job.model.js';
import User from '../models/user.model.js';
import mongoose from "mongoose";


const withValidationError = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                if (errorMessages[0].startsWith("No job")) {
                    throw new NotFoundError(errorMessages);
                }
                if (errorMessages[0].startsWith("Not authorized")) {
                    throw new UnauthorizedError('Not authorized to access this route');
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
};


export const validateTest = withValidationError([
    body('firstName').
        notEmpty().
        withMessage('First name is required')
        .isLength({ min: 3, max: 50 }).
        withMessage('Name must be between 3 and 50 characters long')
        .trim()
]);


export const validateJobInput = withValidationError([
    body('company').notEmpty().withMessage('Company is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('jobLocation').notEmpty().withMessage('Job location is required'),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage("Invalid status value"),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage("Invalid type value"),
]);


export const validateIdParam = withValidationError([
    param('id').custom(async (value, { req }) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new Error('Invalid MongoDB id');

        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`No job with id ${value}`);

        const isAdmin = req.user.role === 'admin';
        const isOwner = req.user.userId === job.createdBy.toString()
        if (!isAdmin && !isOwner) throw new UnauthorizedError('Not authorized to access this route');
    }),
]);


export const validateRegisterInput = withValidationError([
    body('firstName').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage("Invalid email format").
        custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('last name is required')
]);


export const validateLoginInput = withValidationError([
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail().withMessage("Invalid email format")
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new BadRequestError('User does not exist');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('password is required')
])


export const validateUpdateUser = withValidationError([
    body('firstName').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage("Invalid email format").
        custom(async (email, { req }) => {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== req.user.userId) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('last name is required')
]);