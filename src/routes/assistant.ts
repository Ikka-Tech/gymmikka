import express, { Router, Request, Response } from "express";
import OpenAIApi from "openai";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// Initialize the OpenAI API client
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({
  apiKey: openaiApiKey as string,
});

const router: Router = express.Router();

// Use body-parser to parse JSON bodies
router.use(bodyParser.json());

// Endpoint to create an assistant
router.post("/create-assistant", async (req: Request, res: Response) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions:
        "You are a personal math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    res.json(assistant);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a thread
router.post("/create-thread", async (req: Request, res: Response) => {
  try {
    const thread = await openai.beta.threads.create({});
    res.json(thread);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add a message to a thread
router.post("/add-message", async (req: Request, res: Response) => {
  const { threadId, messageContent } = req.body;
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageContent,
    });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to run the assistant
router.post("/run-assistant", async (req: Request, res: Response) => {
  const { threadId, assistantId } = req.body;
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions:
        "Please address the user as Jane Doe. The user has a premium account.",
    });
    res.json(run);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the assistant's response
router.get("/get-responses", async (req: Request, res: Response) => {
  const { threadId } = req.query;
  try {
    const messages = await openai.beta.threads.messages.list(
      threadId as string
    );
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
