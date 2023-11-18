import express, { Router, Request, Response } from "express";
import { processIncomingMessage } from "./../controllers/gym-bot.controller";
import { getUserInstance } from "../services/user.service";
import AssistantService from "../services/thread.service";
import twilio from "twilio";

const router: Router = express.Router();
const phoneNumberRegex = /\bwhatsapp:(\+\d+)/;

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
  const message = req.body.Body;
  const senderNumber: string = req.body.From;

  const matchResult = senderNumber.match(phoneNumberRegex);
  const userId = matchResult ? matchResult[1] : "1";
  // Get the message
  // const message = req.body.message;
  // const userId: number = req.body.userId;
  // Get the threadId using userId from dictionary
  const threadId: string =
    (await getUserInstance().getUserThread(parseInt(userId))) ?? "";
  const assistantSession = new AssistantService(threadId);
  // Add a message to thread
  await assistantSession.addMessage(message);
  const response = await assistantSession.generateResponse();
  sendWhatsAppMessage(senderNumber, response);
  res.send(response);
});

function sendWhatsAppMessage(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = twilio(accountSid, authToken);
  console.info({
    body: body,
    from: `whatsapp:${twilioNumber}`,
    to: `${to}`,
  });
  client.messages
    .create({
      body: body,
      from: `whatsapp:${twilioNumber}`,
      to: `${to}`,
    })
    .then((message) => console.log("Message sent:", message.sid))
    .catch((error) => console.error("Error sending message:", error.message));
}

export default router;
