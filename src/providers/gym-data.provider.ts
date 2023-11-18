import fs from "fs";
import path from "path";

// Define the file path for storing user data
const userDataFilePath = path.join(__dirname, "userData.json");

// Define the provider layer for file operations
class FileDataProvider {
  static readData() {
    try {
      const data = fs.readFileSync(userDataFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  static writeData(data: any) {
    fs.writeFileSync(userDataFilePath, JSON.stringify(data, null, 2), "utf8");
  }
}

// Implementations of methods using file-based storage

function getUserOnboardingStatus(senderNumber: string): string {
  const userData = FileDataProvider.readData();
  const user = userData[senderNumber];
  return user ? user.onboardingStatus : "newJoiner";
}

function isHealthInfoCollected(senderNumber: string): boolean {
  const userData = FileDataProvider.readData();
  const user = userData[senderNumber];
  return user ? user.healthInfoCollected : false;
}

function collectHealthInformation(senderNumber: string, message: string): void {
  const userData = FileDataProvider.readData();
  userData[senderNumber] = {
    onboardingStatus: "onboarded",
    healthInfoCollected: true,
    // Add other user-related data as needed
  };

  FileDataProvider.writeData(userData);
}

function getUserGymPreferences(senderNumber: string): string {
  const userData = FileDataProvider.readData();
  const user = userData[senderNumber];
  return user ? user.gymPreferences || "Not set" : "Not set";
}

export {
  getUserOnboardingStatus,
  isHealthInfoCollected,
  collectHealthInformation,
  getUserGymPreferences,
};
