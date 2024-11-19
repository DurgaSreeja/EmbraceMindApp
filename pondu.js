// Import Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with API key from environment variable
const genAI = new GoogleGenerativeAI("AIzaSyBtLlboADtSAWc7X4N2hk0nPXkCMOPkR8U");

// Get the specific model instance
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the prompt for the AI
const prompt = "Write a story about a magic backpack.";

// Generate content based on the prompt
try {
  const result = await model.generateContent(prompt);

  // Log the generated content
  if (result && result.content) {
    console.log(result.content); // Adjusted to print the actual content property
  } else {
    console.error("No content returned from the model.");
  }
} catch (error) {
  console.error("Error generating content:", error);
}
