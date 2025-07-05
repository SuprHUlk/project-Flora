import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  send,
  reSend,
  get,
  received,
  accept,
} from "../controller/letterController";

const app = express.Router();

app.post("/send", authMiddleware, async (req, res) => {
  try {
    const data = await send(req.body, req.body.user);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/reSend", authMiddleware, async (req, res) => {
  try {
    const data = await reSend(req.body, req.body.user);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/get", authMiddleware, async (req, res) => {
  try {
    const data = await get(req.body.user);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/received", authMiddleware, async (req, res) => {
  try {
    const data = await received(req.body.user);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/accept", authMiddleware, async (req, res) => {
  try {
    const data = await accept(req.body, req.body.user);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default app;
