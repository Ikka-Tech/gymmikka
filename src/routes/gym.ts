import express, { Router, Request, Response } from "express";
import {
  processIncomingMessage,
  handleNewJoinerMessage,
  handleOnboardedUserMessage,
} from "./../controllers/gym-bot.controller";
import { getUserInstance } from "../services/user.service";
import { AssistantService } from "../services/thread.service";

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

router.post("/chat", async (req: Request, res: Response) => {
  // Get the message
  const message = req.body.message;
  const userId: number = req.body.userId;
  // Get the threadId using userId from dictionary
  const threadId: string =
    (await getUserInstance().getUserThread(userId)) ?? "";
  const assistantSession = new AssistantService(threadId);
  // Add a message to thread
  await assistantSession.addMessage(message);
  res.send(await assistantSession.generateResponse());
});

export default router;
