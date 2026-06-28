export interface MicroStep {
  id: string;
  text: string;
  done: boolean;
  timeEstimate: string;
}

export interface AcademicTask {
  id: string;
  title: string;
  course: string;
  dueHours: number;
  complexity: 'High' | 'Medium' | 'Low';
  completedSteps: number;
  totalSteps: number;
  steps: MicroStep[];
  panicScore: number;
  urgencyLevel: 'Crisis' | 'Warning' | 'Safe';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'agent';
  text: string;
  timestamp: string;
  mode?: 'chat' | 'extension' | 'summarize' | 'schedule' | 'suggestions' | 'analysis' | 'meditation';
}

export interface RescuePackage {
  emailDraft: string;
  scheduleBreakdown: { time: string; action: string }[];
  pepTalk: string;
}
