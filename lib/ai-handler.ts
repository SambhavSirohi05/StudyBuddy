'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { StudyNotes } from "@/types";
import { MOCK_BST_NOTES } from "./mock-ai";

const SYSTEM_PROMPT = `
You are an advanced Study Assistant AI capable of generating detailed, structured study notes with visual diagrams.
Your output MUST be a valid JSON object matching this schema:
{
  "is_conversational": boolean, 
  "conversational_response": string, 

  "topic": string,
  "subtopics": [
    {
      "title": string,
      "explanation": string, 
      "diagrams": [
        {
          "diagram_type": "mermaid",
          "diagram_title": string, 
          "diagram_code": string, 
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
2. YOU MUST QUOTE ALL LABELS. Example: A["Start (Process)"] --> B["End [Finish]"]
3. Do NOT use parentheses (), brackets [], or braces {} outside of quotes.
4. Escape quotes inside labels if necessary.
5. Ensure the syntax is strictly valid mermaid.js.
CRITICAL: Return ONLY the JSON object. Do not wrap it in markdown code blocks.
`;

export async function generateStudyNotesAction(userPrompt: string) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("DEBUG: API Key present?", !!apiKey);

        if (!apiKey) {
            console.warn("No API Key found. Using Mock.");
            return MOCK_BST_NOTES;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
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
        let text = response.text();

        if (!text) throw new Error("Empty response from AI");

        // CLEANUP: Remove markdown code blocks
        text = text.replace(/```json\n?|\n?```/g, "").trim();

        // Better Regex for JSON extraction if the above fails to catch trailing text
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            text = text.substring(firstBrace, lastBrace + 1);
        }

        try {
            const data = JSON.parse(text) as StudyNotes;
            console.log("AI Generation Successful");
            return data;
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.log("Raw Text:", text);

            return {
                is_conversational: true,
                conversational_response: text,
                topic: "General",
                subtopics: [],
                exam_notes: [],
                common_mistakes: [],
                revision_tips: []
            } as StudyNotes;
        }

    } catch (error: any) {
        console.error("AI Generation Failed:", error);

        if (error.message?.includes("429") || error.status === 429) {
            throw new Error("Rate limit exceeded. Please try again in a moment.");
        }

        throw new Error("Failed to generate response. Please try again.");
    }
}
