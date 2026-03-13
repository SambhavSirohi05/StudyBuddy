export interface Diagram {
  diagram_title: string;
  diagram_type: "mermaid" | "svg" | "ascii";
  diagram_code: string;
  diagram_explanation: string;
}

export interface Subtopic {
  title: string;
  explanation: string;
  diagrams: Diagram[];
}

export interface ComparisonTable {
  title: string;
  columns: string[];
  rows: { aspect: string; values: string[] }[];
}

export interface StudyNotes {
  topic: string;
  subtopics: Subtopic[];
  comparison_table?: ComparisonTable;
  exam_notes: string[];
  common_mistakes: string[];
  revision_tips: string[];
  conversational_response?: string;
  is_conversational?: boolean;
}

export type MessageContent = string | StudyNotes;

export interface Message {
  role: 'user' | 'assistant';
  content: MessageContent;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
