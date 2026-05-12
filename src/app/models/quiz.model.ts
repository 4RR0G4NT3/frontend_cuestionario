export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  quizzes: string[]; // List of quiz IDs
}
