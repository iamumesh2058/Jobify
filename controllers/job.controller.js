import Job from "../models/job.model.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";
import mongoose from "mongoose";
import day from 'dayjs';


// CREATE JOB
export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    let job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
}


// GET ALL JOBS
export const getAllJobs = async (req, res) => {
    const { search, jobStatus, jobType, sort } = req.query;

    const queryObject = {
        createdBy: req.user.userId
    }

    if (search) {
        queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ]
    }

    if (jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus;
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }

    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position'
    }

    const sortKey = sortOptions[sort] || sortOptions.newest;

    // SETUP PAGINATION
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;


    const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage:page, jobs });
}


// GET SINGLE JOB
export const getSingleJob = async (req, res) => {
    let job = await Job.findById(req.params.id);
    res.status(StatusCodes.OK).json({ job });
}


// UPDATE/EDIT JOB
export const updateJob = async (req, res) => {
    let job = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.send({ msg: "Job updated successfully", job: job });
}


// DELETE JOB
export const deleteJob = async (req, res) => {
    let job = await Job.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
}


// SHOW STATS
export const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ]);

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ]);

    monthlyApplications = monthlyApplications.map((item) => {
        const { _id: { year, month }, count } = item;
        const date = day().month(month - 1).year(year).format('MMM YY')
        return { date, count }
    }).reverse();

    // let monthlyApplications = [
    //     {
    //         date: 'May 23',
    //         count: 12,
    //     },
    //     {
    //         date: 'Jun 23',
    //         count: 9,
    //     },
    //     {
    //         date: 'Jul 23',
    //         count: 3,
    //     },
    // ];

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
}