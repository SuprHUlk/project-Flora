import express from "express";
import {
  email,
  auth,
  logout,
  verify,
  google,
} from "../controller/loginController";
import { authMiddleware } from "../middleware/auth";
// import logger from "../../config/logger";

const app = express.Router();

app.post("/email", async (req, res) => {
  try {
    const data = await email(req.body);
    // logger.info(JSON.stringify(data));
    res.status(data.status).json(data.json);
  } catch (err) {
    // logger.error(JSON.stringify(err));
    res.status(500).json(err);
  }
});

app.post("/auth", async (req, res) => {
  try {
    const data = await auth(req.body, res);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/logout", (_, res) => {
  try {
    const data = logout(res);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/verify", authMiddleware, (req, res) => {
  try {
    const data = verify();
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use("/google", async (req, res) => {
  try {
    const data = await google(req.body, res);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default app;
