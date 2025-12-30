'use server';

import { genAI } from './gemini';
import { MOCK_BST_NOTES } from './mock-ai';
import { StudyNotes } from '@/types';

const SYSTEM_PROMPT = `
You are an Educational AI Agent designed to generate COMPLETE, EXAM-READY STUDY NOTES in strict JSON format.

Your Output Must Be:
1. **Adaptive**: Determine if the user is asking for study material OR casual conversation.
   - If casual (e.g., "Hello", "How are you"), return \`is_conversational: true\` and the response text in \`conversational_response\`.
   - If study-related (e.g., "Explain Quantum Physics"), return \`is_conversational: false\` and populate \`subtopics\` with detailed diagrams.

RULES for Study Notes (is_conversational: false):
- Structured: Follow the JSON schema exactly.
- Visual-first: Include Mermaid.js diagram codes for every subtopic.
- Diagram-rich: Use flowcharts, class diagrams, state diagrams, etc.
- Beginner-friendly but academically correct.
- NEVER summarize lightly for study topics.
- ALWAYS assume the student needs ALL diagrams.
- Diagrams must be provided as CODE (Mermaid), not images.
- Every diagram must have a title, type (mermaid), code, and explanation.

DIAGRAM POLICY:
- Use 'graph TD' or 'graph LR' for flows.
- Use 'classDiagram' for structures.
- Use 'sequenceDiagram' for processes.
- Use 'erDiagram' for entity relationships.
- CRITICAL: ALL node text/labels MUST be enclosed in double quotes.
  - CORRECT: A["This is a label"]
  - WRONG: A[This is a label]
  - Escape double quotes inside labels with \`\\"\`.
- CRITICAL FOR erDiagram:
  - Entities and Attributes containing spaces or special characters MUST be double quoted.
  - CORRECT: Employee["Employee Name"] { string "Job Title" }
  - WRONG: Employee[Employee Name] { string Job Title }
- Styling: Use standard mermaid syntax. Avoid complex styling classes if possible, keep it simple and readable.

JSON SCHEMA:
{
  "topic": "Title of the topic (or 'Conversation' if casual)",
  "is_conversational": boolean,
  "conversational_response": "Response text for casual chat (optional)",
  "subtopics": [
    {
      "title": "Subtopic Title",
      "explanation": "Markdown text explanation...",
      "diagrams": [
        {
          "diagram_title": "Diagram Title",
          "diagram_type": "mermaid",
          "diagram_code": "graph TD; A-->B;",
          "diagram_explanation": "Explanation of the diagram"
        }
      ]
    }
  ],
  "exam_notes": ["Point 1", "Point 2"],
  "common_mistakes": ["Mistake 1", "Mistake 2"],
  "revision_tips": ["Tip 1", "Tip 2"]
}
`;

export async function generateStudyNotesAction(userPrompt: string): Promise<StudyNotes> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("DEBUG: API Key present?", !!apiKey);
  console.log("DEBUG: genAI object is:", genAI ? "Defined" : "Null");

  if (!genAI) {
    console.warn("No GEMINI_API_KEY found. Using mock data.");
    // Should we try to re-initialize here if key exists now?
    // This handles the case where env var loaded AFTER module init (rare but possible in dev?)
    if (apiKey) {
      console.log("DEBUG: Key found but genAI missing. Check lib/gemini.ts");
    }

    // Simulate delay for realism in mock mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_BST_NOTES;
  }

  try {
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

    if (userPrompt.toLowerCase().includes("binary search tree")) {
      return MOCK_BST_NOTES;
    }

    if (error.message?.includes("429") || error.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }

    throw new Error("Failed to generate study notes. Please check API configuration or try again.");
  }
}
