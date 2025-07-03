import express from 'express';
import { email, auth } from '../controller/loginController';

const app = express.Router();

app.post('/email', async (req, res) => {
  try {
    const data = await email(req.body);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/auth', async (req, res) => {
  try {
    const data = await auth(req.body);
    res.status(data.status).json(data.json);
  } catch (err) {
    res.status(500).json(err);
  }
});

// app.use('/google', (req, res) => {
//   res.status(200).send('yes');
// });

export default app;
