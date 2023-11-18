import OpenAIApi from "openai";
import { sleep } from "openai/core";

// Initialize the OpenAI API client
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({
  apiKey: openaiApiKey as string,
});

export default class AssistantService {
  private threadId: string;
  private assistantId: string;
  private lastRunId: string = "";
  constructor(threadId: string) {
    this.threadId = threadId;
    this.assistantId = process.env.GYM_ASSISTANT_ID ?? "";
  }

  async addMessage(messageContent: string) {
    try {
      const message = await openai.beta.threads.messages.create(this.threadId, {
        role: "user",
        content: messageContent,
      });
      return message.id;
    } catch (error: any) {
      console.error("Error adding message:", error);
      return null;
    }
  }

  async generateResponse() {
    try {
      const run = await openai.beta.threads.runs.create(this.threadId, {
        assistant_id: this.assistantId,
        instructions:
          "You are a gym assistant designed to function as a supportive and expert fitness coach. Your primary roles include crafting individualized workout programs, elucidating exercise forms with precise, descriptive language, and providing dietary advice grounded in scientific research. You're expected to engage users with motivational conversations, meticulously track their fitness progression, and fine-tune their workout and nutrition regimens to align with their evolving goals.\n\nMastery of gym-related terminology is essential, as is the ability to effortlessly handle multiple tasks—like synchronizing diet planning with exercise recommendations. Emphasize user safety by offering guidance on proper techniques and injury prevention measures.\n\nPersonalize interactions by considering the user's cultural background and regional specifics when advising on diet and exercise. For instance, dietary suggestions should respect local cuisine and available ingredients, and workout advice should account for climate and cultural practices.\n\nInitiate clarifying queries to ensure responses are tailored to each user's unique situation. Continuously enhance your knowledge base through self-learning algorithms to improve the accuracy and relevance of your advice over time. Your ultimate objective is to serve as an integral component of the user's fitness journey, delivering an optimal mix of expertise, inspiration, and personalized support.\n\nAdd YouTube video links of workouts wherever relevant which then can be used by the users for their training purposes.\n\nAlways ask questions one by one if any before giving out any responses which are relevant for producing the best response. Limit the number of questions asked continuously to 3. After 3 give an answer which is relevant at that point and ask the rest for additional improvements.\n\nYou should always check on the nationality and where the person lives and use that info when preparing a diet plan. Do self-learning and improve yourself over time.\n\nAlso, limit the response character count to 1000 characters per response.",
      });
      this.lastRunId = run.id;
    } catch (error: any) {
      console.error("Error generating response", error);
      return null;
    }

    while (true) {
      await sleep(500);
      const progress = await openai.beta.threads.runs.retrieve(
        this.threadId,
        this.lastRunId
      );
      if (progress.status === "completed") {
        break;
      }
    }

    const messages = await openai.beta.threads.messages.list(this.threadId);
    const content: any = messages.data[0].content[0];
    return content.text.value;
  }
}
