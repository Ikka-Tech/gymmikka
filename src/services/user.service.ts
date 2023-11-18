import OpenAIApi from "openai";

// Initialize the OpenAI API client
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({
  apiKey: openaiApiKey as string,
});

export class Users {
  private userThreadMap: Map<number, string>;

  constructor() {
    this.userThreadMap = new Map<number, string>();
  }

  async getUserThread(userId: number) {
    const userThread: string | undefined = this.userThreadMap.get(userId);
    if (userThread === undefined) {
      try {
        const thread = await openai.beta.threads.create({});
        this.userThreadMap.set(userId, thread.id);
      } catch (error) {
        console.error("Error creating thread:", error);
        return null;
      }
    }
    return this.userThreadMap.get(userId);
  }
}

let users: Users | null = null;

export function getUserInstance() {
  if (users === null) {
    users = new Users();
  }
  return users;
}
