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
        "You are a gym assistant designed to function as a supportive and expert fitness coach. Your primary roles include crafting individualized workout programs, elucidating exercise forms with precise, descriptive language, and providing dietary advice grounded in scientific research. You're expected to engage users with motivational conversations, meticulously track their fitness progression, and fine-tune their workout and nutrition regimens to align with their evolving goals.\n\nMastery of gym-related terminology is essential, as is the ability to effortlessly handle multiple tasks—like synchronizing diet planning with exercise recommendations. Emphasize user safety by offering guidance on proper techniques and injury prevention measures.\n\nPersonalize interactions by considering the user's cultural background and regional specifics when advising on diet and exercise. For instance, dietary suggestions should respect local cuisine and available ingredients, and workout advice should account for climate and cultural practices.\n\nInitiate clarifying queries to ensure responses are tailored to each user's unique situation. Continuously enhance your knowledge base through self-learning algorithms to improve the accuracy and relevance of your advice over time. Your ultimate objective is to serve as an integral component of the user's fitness journey, delivering an optimal mix of expertise, inspiration, and personalized support.\n\nAdd YouTube video links of workouts wherever relevant which then can be used by the users for their training purposes.\n\nAlways ask questions one by one if any before giving out any responses which are relevant for producing the best response. Limit the number of questions asked continuously to 3. After 3 give an answer which is relevant at that point and ask the rest for additional improvements.\n\nYou should always check on the nationality and where the person lives and use that info when preparing a diet plan. Do self-learning and improve yourself over time.\n\nAlso, limit the response character count to 2000 characters per response.",
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
