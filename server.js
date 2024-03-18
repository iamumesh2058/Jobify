import "express-async-errors";
import express from "express";
import * as dotenv from 'dotenv';
dotenv.config();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';

const app = express()

// ROUTES
import jobRoutes from "./routes/job.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";


// public
import { dirname } from 'path';
import { fileURLToPath } from "url";
import path from "path";


// middleware
import errorHandlerMiddleware from "./middleware/errorHanlderMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'developemnt') {
    app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, './client/dist')))
app.use(cookieParser());
app.use(express.json());


// USING ROUTES
app.use("/api/jobs", authenticateUser, jobRoutes);
app.use("/api/users", authenticateUser, userRoutes);
app.use("/api/auth/", authRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
})


app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);


// DATABASE CONNECTION
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log("Server running...");
        });
    })
    .catch((error) => {
        console.log("Error during database connection");
    });
