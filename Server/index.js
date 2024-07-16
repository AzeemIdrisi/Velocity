import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DB_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

//setting up routes

app.use("/api/auth", authRoutes);
const server = app.listen(port, () => {
  console.log(`Server started at : http://localhost:${port}`);
});

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((e) => {
    console.log("MongoDB Connection Failed", e);
  });
