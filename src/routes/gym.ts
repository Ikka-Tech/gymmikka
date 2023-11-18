import express, { Router } from "express";
import {
  processIncomingMessage,
  handleNewJoinerMessage,
  handleOnboardedUserMessage,
} from "./../controllers/gym-bot.controller"; // Import your message processing functions

const router: Router = express.Router();

router.post("/webhook", async (req, res) => {
  const { Body, From } = req.body;

  try {
    const response = await processIncomingMessage(Body, From);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
