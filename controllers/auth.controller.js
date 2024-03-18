import User from '../models/user.model.js';
import { StatusCodes } from "http-status-codes";
import { hashedPassword, comparePassword } from '../utils/password.utils.js';
import { UnauthenticatedError } from '../errors/customError.js';
import { createJWT } from '../utils/token.utils.js';

export const register = async (req, res) => {
    const isFirstAccount = await User.countDocuments() === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';

    const hashedPasswords = await hashedPassword(req.body.password);
    req.body.password = hashedPasswords;

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "User created" });
};


export const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    const isValidUser = user && (await comparePassword(req.body.password, user.password));
    if (!isValidUser) throw new UnauthenticatedError("Invalid credenttials");

    const token = createJWT({ userId: user._id, role: user.role });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(StatusCodes.OK).json({ msg : "User logged in"});
};


export const logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: "User logged out!"});
}