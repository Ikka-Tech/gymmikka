// Import the required libraries
const express = require("express");
const OpenAIApi = require("openai");
const bodyParser = require("body-parser");

// Initialize the Express app
const app = express();
const port = 3000;

// OpenAI API key
const openaiApiKey = "OPENAI_API_KEY"; // Replace with your OpenAI API key

// Initialize the OpenAI API client
const openai = new OpenAIApi({
  apiKey: openaiApiKey,
});

// Use body-parser to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to create an assistant
app.post("/create-assistant", async (req, res) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions:
        "You are a personal math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });
    res.json(assistant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a thread
app.post("/create-thread", async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to add a message to a thread
app.post("/add-message", async (req, res) => {
  const { threadId, messageContent } = req.body;
  try {
    const message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: messageContent,
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to run the assistant
app.post("/run-assistant", async (req, res) => {
  const { threadId, assistantId } = req.body;
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions:
        "Please address the user as Jane Doe. The user has a premium account.",
    });
    res.json(run);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the assistant's response
app.get("/get-responses", async (req, res) => {
  const { threadId } = req.query;
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
