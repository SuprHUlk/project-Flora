import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import loginRoute from "./api/route/loginRoute";

const PORT = process.env.PORT!;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING!;

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // Specify the exact origin instead of wildcard
  credentials: true, // Allow credentials to be included
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

const connect = async () => {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION_STRING);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection failed: " + err);
  }
};

connect();

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Routes
app.use("/login", loginRoute);

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
