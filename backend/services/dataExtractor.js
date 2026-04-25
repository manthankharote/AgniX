import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini API (Make sure to add GEMINI_API_KEY to your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are the 'AgniX AI Data Extractor', a specialized backend processor for an agricultural recommendation system in Maharashtra, India. 
Your ONLY job is to analyze the user's input (which will be in Hindi, Marathi, Hinglish, or English) and extract 3 specific data points. 

You must return the extracted data strictly as a valid JSON object. Do NOT include markdown formatting (like \`\`\`json), conversational text, greetings, explanations, or any other words outside the JSON structure.

EXTRACT THE FOLLOWING FIELDS:

1. "pincode" (Number or String): 
   - Look for a 6-digit Indian postal code.
   - If found, extract just the 6 digits. 
   - If not mentioned, return the string "unknown".

2. "soil_type" (String): 
   - Analyze the text for soil descriptions and map it STRICTLY to one of these exact values: "black_cotton", "red", "sandy", or "unknown".
   - Mapping guide: 'kali', 'kaali', 'black', 'cotton' -> "black_cotton". 'lal', 'red' -> "red". 'retili', 'bhalu', 'sandy' -> "sandy".
   - If not mentioned, return "unknown".

3. "water_source" (String): 
   - Analyze the text for water/irrigation availability and map it STRICTLY to one of these exact values: "rainfed", "irrigated", or "unknown".
   - Mapping guide: 'barish', 'baarish', 'rain', 'monsoon' -> "rainfed". 'kuwa', 'tube well', 'borwell', 'canal', 'paani hai' -> "irrigated".
   - If not mentioned, return "unknown".

CRITICAL RULES:
- If the user sends a simple greeting like "Hi", "Hello", "Ram Ram", return: {"pincode": "unknown", "soil_type": "unknown", "water_source": "unknown"}
- Your output must be parseable by JSON.parse() in JavaScript.`;

export async function extractDataWithLLM(userMessage) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY is not set in environment variables.");
            throw new Error("GEMINI_API_KEY is missing");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const finalPrompt = `${systemPrompt}\n\nUser Message: "${userMessage}"\nOutput JSON:`;

        const result = await model.generateContent(finalPrompt);
        const response = result.response;
        let rawText = response.text();
        
        // Clean the response just in case the LLM added markdown backticks
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        return JSON.parse(rawText);
    } catch (error) {
        console.error("Error in extractDataWithLLM:", error);
        // Return a default structure in case of failure or if the user sends something unparseable
        return {
            "pincode": "unknown",
            "soil_type": "unknown",
            "water_source": "unknown"
        };
    }
}
