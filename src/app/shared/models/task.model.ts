export type TaskCategory = 'PESQUISA' | 'PRATICA' | 'ASSISTIR_VIDEOAULA';

export interface Task {
  id: string;
  enrollmentId: string;
  date: string;
  category: TaskCategory;
  description: string;
  timeSpent: number;
}

export interface TaskPayload {
  enrollmentId: string;
  date: string;
  category: TaskCategory;
  description: string;
  timeSpentMinutes: number;
}

export interface EnrollmentOption {
  id: string;
  label: string;
}
