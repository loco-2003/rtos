export type TaskType = 'Hard' | 'Soft';

export interface Task {
  id: string;
  name: string;
  period: number; // seconds
  wcet: number; // milliseconds
  deadline: number; // seconds
  type: TaskType;
  color: string;
}

export const TASKS: Task[] = [
  { id: 'clock_sync', name: 'Clock Sync', period: 1, wcet: 100, deadline: 1, type: 'Hard', color: '#3b82f6' }, // blue-500
  { id: 'timer_update', name: 'Timer Update', period: 1, wcet: 50, deadline: 1, type: 'Soft', color: '#10b981' }, // emerald-500
  { id: 'cheating_detect', name: 'Cheating Detection', period: 2, wcet: 400, deadline: 2, type: 'Soft', color: '#f59e0b' }, // amber-500
  { id: 'logging', name: 'Logging', period: 5, wcet: 200, deadline: 5, type: 'Soft', color: '#6366f1' }, // indigo-500
];

export const AUTO_SUBMIT_TASK: Task = {
  id: 'auto_submit',
  name: 'Auto Submit',
  period: 0, // Aperiodic
  wcet: 150,
  deadline: 0, // Immediate
  type: 'Hard',
  color: '#ef4444', // red-500
};
