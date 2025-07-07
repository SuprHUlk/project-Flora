import express from "express";
import { authMiddleware } from "../middleware/auth";
import { get, getFriends } from "../controller/profileController";

const app = express.Router();

app.get("/get", authMiddleware, async (req, res) => {
    try {
        const data = await get(req.body.user);
        res.status(data.status).json(data.json);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/getFriends", authMiddleware, async (req, res) => {
    try {
        const data = await getFriends(req.body.user);
        res.status(data.status).json(data.json);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default app;
