import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "node:http";

import connectMongoDB from "./database/mongoDb";
import Redis from "./database/redis";
import { connectFirebase } from "./database/firebase";
import { initSocket } from "./handler/socket";

import loginRoute from "./api/route/loginRoute";
import letterRoute from "./api/route/letterRoutes";
import profileRoute from "./api/route/profileRoute";
import chatRoute from "./api/route/chatRoute";

import notificationMiddleware from "./api/middleware/notification";

import logger from "./config/logger";

const PORT = process.env.PORT!;

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

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//Routes
app.use("/login", loginRoute);
app.use("/letter", letterRoute);
app.use("/profile", profileRoute);
app.use("/chat", chatRoute);

app.use(notificationMiddleware);

//health route
app.get("/", (_, res) => {
    res.status(200).send("OK");
});

const server = createServer(app);

connectMongoDB();
connectFirebase();
Redis.getInstance();
initSocket(server);

server.listen(PORT, () => {
    logger.info("Listening on: " + PORT);
});
