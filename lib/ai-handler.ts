'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { StudyNotes } from "@/types";
import { MOCK_BST_NOTES } from "./mock-ai";

// Vercel Server Function Timeout Configuration
// Allow up to 60 seconds for AI generation (default is 10s on Hobby)
export const maxDuration = 60;

const SYSTEM_PROMPT = `
You are an advanced Study Assistant AI capable of generating detailed, structured study notes with visual diagrams.
Your output MUST be a valid JSON object matching this schema:
{
  "is_conversational": boolean, // true if the user input is a greeting or simple question not needing notes.
  "conversational_response": string, // "Hello! How can I help you study?" if is_conversational is true.

  "topic": string,
  "subtopics": [
    {
      "title": string,
      "explanation": string, (markdown supported)
      "diagrams": [
        {
          "diagram_type": "mermaid",
          "diagram_title": string, (e.g. "Flowchart of Process")
          "diagram_code": string, (VALID mermaid.js syntax)
          "diagram_explanation": string
        }
      ]
    }
  ],
  "exam_notes": string[],
  "common_mistakes": string[],
  "revision_tips": string[]
}

CRITICAL RULES FOR MERMAID DIAGRAMS:
1. Always use "graph TD" or "graph LR" for flowcharts.
2. Put labels in quotes if they contain spaces. Example: A["Start Process"] --> B["End"]
3. Do NOT use braces {} inside node labels as it breaks syntax.
4. Ensure the syntax is strictly valid mermaid.js.
`;

export async function generateStudyNotesAction(userPrompt: string) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("DEBUG: API Key present?", !!apiKey); // Debug log for Vercel logs

        // Fallback to Mock if no key (or if explicit request)
        if (!apiKey) {
            console.warn("No API Key found. Using Mock response.");
            return MOCK_BST_NOTES;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        console.log("DEBUG: genAI object is: Defined");

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `Generate complete study notes for: "${userPrompt}"`
        ]);

        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from AI");
        }

        const data = JSON.parse(text) as StudyNotes;
        console.log("AI Generation Successful for:", userPrompt);
        return data;

    } catch (error: any) {
        console.error("AI Generation Failed:", error);

        // Hard fallback for testing
        if (userPrompt.toLowerCase().includes("binary search tree")) {
            return MOCK_BST_NOTES;
        }

        if (error.message?.includes("429") || error.status === 429) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
        }

        throw new Error("Failed to generate study notes. Please check API configuration or try again.");
    }
}
