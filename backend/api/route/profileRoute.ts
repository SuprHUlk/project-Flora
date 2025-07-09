import express from "express";
import { authMiddleware } from "../middleware/auth";
import { get, getFriends, edit } from "../controller/profileController";
import upload from "../middleware/multer";

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

app.post(
    "/edit",
    authMiddleware,
    upload.single("photoUrl"),
    async (req, res) => {
        try {
            const data = await edit(req.body, req.user, req.file?.path);
            res.status(data.status).json(data.json);
        } catch (err) {
            res.status(500).json({ error: String(err) });
        }
    }
);

export default app;
