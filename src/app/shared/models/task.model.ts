export type TaskCategory = 'PESQUISA' | 'PRATICA' | 'ASSISTIR_VIDEOAULA';

export interface Task {
  id: string;
  date: string;
  category: TaskCategory;
  description: string;
  timeSpent: number;
}

export interface TaskPayload {
  date: string;
  category: TaskCategory;
  description: string;
  timeSpent: number;
}
