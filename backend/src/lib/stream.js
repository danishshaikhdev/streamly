import { StreamChat } from "stream-chat";
import "dotenv/config";

// Initialize Stream Chat Client
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// check if the API keys are available
if (!apiKey || !apiSecret) {
  console.error("Stream API key or secret is missing");
}

// initialize the client
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Function to upsert a user in Stream
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

// Function to generate a Stream token for a user
export const generateStreamToken = (userId) => {
  // we will do this later
};
