import express from "express";
import { get } from "../controller/chatController";
import { authMiddleware } from "../middleware/auth";

const app = express.Router();

app.get("/get/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Missing id parameter" });
        }

        const idString = Array.isArray(id) ? id[0] : id;
        const data = await get(idString, req.body.user);
        res.status(data.status).json(data.json);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default app;
