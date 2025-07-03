import express from "express";
import { email, auth, logout, verify } from "../controller/loginController";
import { authMiddleware } from "../middleware/auth";
// import logger from "../../config/logger";

const app = express.Router();

const TOKEN_EXPIRATION_TIME: number = parseInt(
  process.env.TOKEN_EXPIRATION_TIME!
);

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
    const data = await auth(req.body);
    res.cookie("token", data.json.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: TOKEN_EXPIRATION_TIME,
    });
    delete data.json["token"];
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

// app.use('/google', (req, res) => {
//   res.status(200).send('yes');
// });

export default app;
