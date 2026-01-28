export enum ClassSubject {
  MATH = 'Mathematics',
  SCIENCE = 'Science',
  HISTORY = 'History',
  LITERATURE = 'Literature',
  CS = 'Computer Science',
  GENERAL = 'General'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface CourseDocument {
  id: string;
  name: string;
  type: string; // 'pdf', 'docx', 'img', etc.
  size: string;
  uploadDate: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  name: string;
  subject: ClassSubject;
  color: string; // Tailwind class for background (e.g., 'bg-blue-500')
  icon: string;
  notes: Note[];
  documents: CourseDocument[];
  flashcards?: Flashcard[]; // Optional for now, usually generated on fly
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface EssayFeedback {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

export type TabView = 'quicksolve' | 'chat' | 'notes' | 'grader' | 'study';