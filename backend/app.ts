import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import loginRoute from "./api/route/loginRoute";
import letterRoute from "./api/route/letterRoutes";

const PORT = process.env.PORT!;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING!;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://chatflora.suprhulk.com",
      "https://project-flora-git-main-suprhulks-projects.vercel.app",
      "https://project-flora-suprhulks-projects.vercel.app",
      "https://project-flora.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection failed: " + err);
  }
}

connectMongoDB();

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Routes
app.use("/login", loginRoute);
app.use("/letter", letterRoute);

app.use("/", (_, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("Cannot start the server: ", err);
  } else {
    console.log("Listening on: " + 3000);
  }
});
