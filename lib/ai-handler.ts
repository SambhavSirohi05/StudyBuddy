'use server';

import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { StudyNotes, Message } from "@/types";
import { MOCK_BST_NOTES } from "./mock-ai";

const MAX_HISTORY_MESSAGES = 10; // Keep last 10 messages to stay token-efficient on free tier

const SYSTEM_PROMPT = `
You are an advanced Study Assistant AI capable of generating detailed, structured study notes with visual diagrams.
You have memory of previous messages in this conversation. Use them to understand context and follow-up questions.

IMPORTANT RULES FOR FOLLOW-UP MESSAGES:
- If the user asks a follow-up like "explain that simpler", "give me a diagram", "compare it with X", etc., you MUST generate FULL study notes (with topic, subtopics, diagrams, exam_notes, etc.) — NOT just a conversational response.
- ONLY set "is_conversational": true for greetings ("hi", "hello", "thanks") or questions completely unrelated to studying. For EVERYTHING else, generate full structured notes.
- When a follow-up references something from earlier (like "that", "it", "this topic"), use the conversation history to understand what they're referring to.

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
  "comparison_table": {
    "title": string,
    "columns": string[],
    "rows": [{ "aspect": string, "values": string[] }]
  } | null,
  "exam_notes": string[],
  "common_mistakes": string[],
  "revision_tips": string[]
}

COMPARISON TABLE RULES:
- If the user asks about differences, comparisons, or "vs" topics (e.g., "TCP vs UDP", "Stack vs Queue", "BFS vs DFS"), you MUST include a "comparison_table".
- "columns" should be the names of the items being compared (e.g., ["TCP", "UDP"]).
- "rows" should have an "aspect" (the comparison criteria) and "values" (one per column).
- Include 5-8 meaningful comparison rows.
- If the topic is NOT a comparison, set "comparison_table" to null.

CRITICAL RULES FOR MERMAID DIAGRAMS:
1. Always use "graph TD" or "graph LR" for flowcharts.
2. EVERY node label MUST be wrapped in double quotes inside brackets. Example: A["Start"] --> B["End"]
3. NEVER use unquoted labels. WRONG: A[Start Process] CORRECT: A["Start Process"]
4. For labels with special characters like parentheses, brackets, pipes, or ampersands, ALWAYS quote them: A["Label (with parens)"] --> B["Label [with brackets]"]
5. Use simple alphanumeric node IDs (A, B, C1, node1, etc). Do NOT use special characters in node IDs.
6. Use --> for arrows, --- for lines, -.-> for dotted arrows.
7. Ensure the syntax is strictly valid mermaid.js. Test mentally before outputting.
CRITICAL: Return ONLY the JSON object. Do not wrap it in markdown code blocks.
`;

/**
 * Convert app messages to Gemini's history format.
 * Assistant messages (StudyNotes) are summarized to save tokens.
 */
function buildChatHistory(messages: Message[]): Content[] {
    // Take only the last N messages
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    return recentMessages.map((msg) => {
        if (msg.role === 'user') {
            return {
                role: 'user' as const,
                parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }],
            };
        } else {
            // Summarize assistant StudyNotes to save tokens
            let summary: string;
            if (typeof msg.content === 'string') {
                summary = msg.content;
            } else {
                const notes = msg.content as StudyNotes;
                if (notes.is_conversational && notes.conversational_response) {
                    summary = notes.conversational_response;
                } else {
                    const subtopicTitles = notes.subtopics?.map(s => s.title).join(', ') || '';
                    summary = `Generated study notes on "${notes.topic}". Subtopics covered: ${subtopicTitles}`;
                }
            }
            return {
                role: 'model' as const,
                parts: [{ text: summary }],
            };
        }
    });
}

export async function generateStudyNotesAction(userPrompt: string, previousMessages: Message[] = []) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("DEBUG: API Key present?", !!apiKey);

        // ALWAYS Return mock to save API quota while testing UI
        console.warn("Forcing Mock Response for UI testing.");
        await new Promise(res => setTimeout(res, 1500)); // fake delay
        return MOCK_BST_NOTES;

        const genAI = new GoogleGenerativeAI(apiKey as string);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
            systemInstruction: SYSTEM_PROMPT,
        });

        // Build conversation history from previous messages
        const history = buildChatHistory(previousMessages);

        // Use multi-turn chat for context awareness
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(`Generate complete study notes for: "${userPrompt}"`);

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

