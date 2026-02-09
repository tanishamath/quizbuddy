
export enum UserRole {
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT'
}

export type QuestionType = 'single' | 'multiple';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: number[]; // Indices of correct options
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  durationMinutes: number;
  dueDate: string;
  createdAt: string;
  questions: Question[];
  createdBy: string;
}

export interface Submission {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, number[]>; // questionId -> list of selected indices
  score: number;
  totalPossible: number;
  timestamp: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
