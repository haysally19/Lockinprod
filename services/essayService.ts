import { EssayFeedback } from '../types';

export interface EssaySubmission {
  id: string;
  courseId: string;
  courseName: string;
  topic: string;
  essayContent: string;
  feedback: EssayFeedback;
  submittedAt: string;
}

const STORAGE_KEY = 'lockin_essay_submissions';

export const essayService = {
  saveSubmission: (submission: Omit<EssaySubmission, 'id' | 'submittedAt'>): EssaySubmission => {
    const submissions = essayService.getAllSubmissions();
    const newSubmission: EssaySubmission = {
      ...submission,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };

    submissions.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return newSubmission;
  },

  getAllSubmissions: (): EssaySubmission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading essay submissions:', error);
      return [];
    }
  },

  getSubmissionsByCourse: (courseId: string): EssaySubmission[] => {
    return essayService.getAllSubmissions().filter(s => s.courseId === courseId);
  },

  deleteSubmission: (id: string): void => {
    const submissions = essayService.getAllSubmissions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
