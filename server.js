import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dbConnect from "./database/dbConnect.js";

import adminRouter from "./Routes/adminRouter.js";
import hrRouter from "./Routes/hrRouter.js";
import authRouter from "./Routes/authRouter.js";
import dataRouter from "./Routes/dataRouter.js";
import profileRouter from "./Routes/profileRouter.js";

import requestLogger from "./Middleware/requestLogger.js";
import { errorHandler } from "./Utils/globalError.js";
import { limiter } from "./Config/ratelimiter.js";

const app = express();

dbConnect();

app.get("/", (req, res) => {
  res.status(200).send("CRM Backend is running");
});

app.use(requestLogger);
app.use(limiter);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/hr", hrRouter);
app.use("/api", authRouter);
app.use("/api", dataRouter);
app.use("/api", profileRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
