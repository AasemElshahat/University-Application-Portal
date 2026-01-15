import "dotenv/config";
import express from "express";

import https from "https";
import fs from "fs";
import cors from "cors";
import { connectDB } from "./database/db";

import publicUserRouter from "./endpoints/user/PublicUsersRoute";
import authenticationRouter from "./endpoints/authentication/AuthenticationRoute";
import userRouter from "./endpoints/user/UserRoute";
import degreeCourseRouter from "./endpoints/degreeCourses/DegreeCourseRoute";
import applicationRouter from "./endpoints/degreeCourseApplications/ApplicationRoute";

import { UserModel } from "./endpoints/user/UserModel";
import UserService from "./endpoints/user/UserService";

const app = express();
const port = process.env.PORT || 443;

app.use(
  cors({
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

app.use("/api/publicUsers", publicUserRouter);
app.use("/api/authenticate", authenticationRouter);
app.use("/api/users", userRouter);
app.use("/api/degreeCourses", degreeCourseRouter);
app.use("/api/degreeCourseApplications", applicationRouter);

async function startServer() {
  try {
    await connectDB();

    const userCount = await UserModel.find().countDocuments();

    if (userCount === 0) {
      console.log(
        "No users found. Creating default admin with userID 'admin'..."
      );

      await UserService.createUser({
        userID: "admin",
        password: "123",
        isAdministrator: true,
      });
      console.log(
        "Default admin with userID 'admin' has been successfully created"
      );
    } else {
      console.log("an admin user already exists!");
    }

    const httpOptions = {
      key: fs.readFileSync(process.env.CERT_KEY_PATH || "./certificates/key.pem"),
      cert: fs.readFileSync(process.env.CERT_PATH || "./certificates/cert.pem"),
    };

    https.createServer(httpOptions, app).listen(port, () => {
      console.log(`Secure Server is runnung on https://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    throw error;
  }
}

startServer();
