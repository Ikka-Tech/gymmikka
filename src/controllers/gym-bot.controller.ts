// gymBot.ts

import {
  getUserOnboardingStatus,
  isHealthInfoCollected,
  collectHealthInformation,
  getUserGymPreferences,
} from "./../providers/gym-data.provider";

async function processIncomingMessage(
  message: string,
  senderNumber: string
): Promise<string> {
  // Logic to determine the user's onboarding status
  const onboardingStatus = getUserOnboardingStatus(senderNumber);

  if (onboardingStatus === "newJoiner") {
    return handleNewJoinerMessage(message, senderNumber);
  } else if (onboardingStatus === "onboarded") {
    return handleOnboardedUserMessage(message, senderNumber);
  } else {
    return "Invalid onboarding status";
  }
}

async function handleNewJoinerMessage(
  message: string,
  senderNumber: string
): Promise<string> {
  // Logic to handle messages for new joiners
  if (!isHealthInfoCollected(senderNumber)) {
    // If health information is not collected, collect it
    collectHealthInformation(senderNumber, message);
    return "Thank you for providing your health information. Your onboarding is in progress.";
  } else {
    // If health information is already collected, handle other scenarios
    // Add your logic here
    return "Your onboarding is in progress. How can I assist you today?";
  }
}

async function handleOnboardedUserMessage(
  message: string,
  senderNumber: string
): Promise<string> {
  // Logic to handle messages for onboarded users
  // Add your logic here
  return "How can I assist you today?";
}

export {
  processIncomingMessage,
  handleNewJoinerMessage,
  handleOnboardedUserMessage,
};
