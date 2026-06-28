import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini lazily
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Initial Mock Tasks with Panic Calculation
export interface TaskItem {
  id: string;
  title: string;
  course: string;
  dueHours: number;
  complexity: 'High' | 'Medium' | 'Low';
  completedSteps: number;
  totalSteps: number;
  steps: { id: string; text: string; done: boolean; timeEstimate: string }[];
  panicScore: number;
  urgencyLevel: 'Crisis' | 'Warning' | 'Safe';
  notes?: string;
}

const initialTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Advanced ML Problem Set',
    course: 'CS 6400 - Machine Learning',
    dueHours: 4,
    complexity: 'High',
    completedSteps: 1,
    totalSteps: 5,
    steps: [
      { id: '1-1', text: 'Open Jupyter notebook and load dataset', done: true, timeEstimate: '2 mins' },
      { id: '1-2', text: 'Write baseline logistic regression script', done: false, timeEstimate: '10 mins' },
      { id: '1-3', text: 'Implement custom attention layer equations', done: false, timeEstimate: '25 mins' },
      { id: '1-4', text: 'Run 5-fold cross validation grid search', done: false, timeEstimate: '15 mins' },
      { id: '1-5', text: 'Export accuracy plots & write 1-page summary', done: false, timeEstimate: '10 mins' }
    ],
    panicScore: 94,
    urgencyLevel: 'Crisis',
    notes: 'Covers neural architectures & loss functions. Prof strictly enforces 11:59pm cutoff.'
  },
  {
    id: 'task-2',
    title: 'Literature Review Essay Outline',
    course: 'HUM 301 - Modern Ethics',
    dueHours: 24,
    complexity: 'Medium',
    completedSteps: 2,
    totalSteps: 5,
    steps: [
      { id: '2-1', text: 'Download 3 primary source PDFs from library portal', done: true, timeEstimate: '5 mins' },
      { id: '2-2', text: 'Highlight thesis statement in each PDF', done: true, timeEstimate: '15 mins' },
      { id: '2-3', text: 'Draft introduction paragraph with hook', done: false, timeEstimate: '12 mins' },
      { id: '2-4', text: 'Create bulleted list of 4 body paragraph arguments', done: false, timeEstimate: '20 mins' },
      { id: '2-5', text: 'Format APA bibliography entries', done: false, timeEstimate: '8 mins' }
    ],
    panicScore: 68,
    urgencyLevel: 'Warning',
    notes: 'Requires at least 5 peer-reviewed citations.'
  },
  {
    id: 'task-3',
    title: 'Register for Next Semester Electives',
    course: 'REG 101 - Academic Advising',
    dueHours: 96, // 4 days
    complexity: 'Low',
    completedSteps: 0,
    totalSteps: 4,
    steps: [
      { id: '3-1', text: 'Log into Student Degree Works portal', done: false, timeEstimate: '2 mins' },
      { id: '3-2', text: 'Check prerequisite clearances for Distributed Systems', done: false, timeEstimate: '5 mins' },
      { id: '3-3', text: 'Add CRN 44091 and CRN 88210 to draft cart', done: false, timeEstimate: '3 mins' },
      { id: '3-4', text: 'Submit registration and save confirmation PDF', done: false, timeEstimate: '2 mins' }
    ],
    panicScore: 22,
    urgencyLevel: 'Safe',
    notes: 'Window closes Friday at 5:00pm.'
  }
];

// API Routes
app.get('/api/tasks', (req, res) => {
  res.json({ tasks: initialTasks });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, activeTask, mode } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Intelligent fallback when API key is not configured
      let fallbackText = "I'm right here with you! Take a slow, deep breath in... and let it out. Deadline paralysis is biological, not a personal failure.";
      if (mode === 'extension') {
        fallbackText = `Subject: Extension Request - ${activeTask?.title || 'Assignment'}\n\nDear Professor,\n\nI hope this email finds you well. I am writing to respectfully request a brief 24-hour extension on the ${activeTask?.title || 'upcoming assignment'}, due in ${activeTask?.dueHours || 'a few'} hours. I have been working diligently through the problem set, but encountered unexpected technical blockers and want to ensure I submit work that reflects my full academic understanding.\n\nThank you very much for your time, understanding, and consideration.\n\nBest regards,\n[Your Name]`;
      } else if (mode === 'summarize') {
        fallbackText = `⚡ Quick Study Rescue Summary:\n\nFor **${activeTask?.title || 'your task'}**, focus strictly on the 80/20 rule:\n1. Ignore secondary formatting right now.\n2. Execute Step 1 (${activeTask?.steps?.[0]?.text || 'the first micro-step'}).\n3. Do a 20-minute sprint with phone in another room.\n\nYou've got this. Momentum cures anxiety!`;
      } else if (mode === 'schedule') {
        fallbackText = `🗓️ Emergency Focus Blocks (Next 2 Hours):\n\n• **00:00 - 00:25**: Sprint 1 (${activeTask?.steps?.find((s:any)=>!s.done)?.text || 'Next micro-step'})\n• **00:25 - 00:30**: 5-min dopamine reset (drink water, stretch)\n• **00:30 - 00:55**: Sprint 2 (Deep focus execution)\n• **00:55 - 01:00**: Quick review & submission check`;
      } else if (mode === 'suggestions') {
        fallbackText = `💡 Smart Suggestions for **${activeTask?.title || 'this assignment'}**:\n\n1. **Dopamine Kickstart**: Begin with the easiest 2-minute task first.\n2. **Draft Dirty**: Write in bullet points instead of full sentences for your first draft.\n3. **Tab Isolation**: Close all tabs except your primary document and sources.`;
      } else if (mode === 'analysis') {
        fallbackText = `📈 Real-Time Stress Analysis:\n\n• **Cortisol Index**: ELEVATED (${activeTask?.dueHours || 12}h deadline window)\n• **Paralysis Source**: Overwhelm from total step volume\n• **Immediate De-escalation**: Commit to working for exactly 120 seconds, then check in with me.`;
      } else if (mode === 'meditation') {
        fallbackText = `🧘‍♀️ 5-Minute Box Breathing Protocol:\n\n1. **Inhale slowly** through your nose (4s)\n2. **Hold gently** at the top (4s)\n3. **Exhale completely** through your mouth (4s)\n4. **Rest empty** at the bottom (4s)\n\nRepeat 4 times. Your biology is calming down. You are safe.`;
      } else if (message?.toLowerCase().includes('help') || message?.toLowerCase().includes('panic') || message?.toLowerCase().includes('stressed')) {
        fallbackText = `I hear you loud and clear. When deadlines squeeze to ${activeTask?.dueHours || 4} hours, your amygdala spikes cortisol. Let's trick your brain: we aren't finishing the whole assignment right now. We are *only* doing the next 2-minute step. Can you commit to 120 seconds?`;
      }
      return res.json({ response: fallbackText });
    }

    // Call Gemini API
    const prompt = `You are "PanicMode AI", an elite, highly empathetic, high-urgency academic productivity rescue coach.
A student is experiencing deadline paralysis and needs immediate cognitive unblocking.
Active Task in focus: ${activeTask ? `${activeTask.title} (${activeTask.course}, Due in ${activeTask.dueHours} hours, Complexity: ${activeTask.complexity})` : 'None specified'}.

Student mode requested: ${mode || 'chat'}
Student message: "${message}"

Instructions:
- Keep tone ultra-supportive, direct, action-oriented, and psychological (calming down the amygdala fight-or-flight response).
- Use formatting (bullet points, bold text) for rapid readability under extreme stress.
- If mode is 'extension', write a formal, highly diplomatic, realistic extension request email to their professor.
- If mode is 'summarize', give a hyper-dense 3-bullet core action cheat sheet.
- If mode is 'schedule', create an urgent micro-Pomodoro block breakdown.
- If mode is 'suggestions', provide 3 smart actionable tips to overcome paralysis.
- If mode is 'analysis', provide a brief physiological stress analysis and instant de-escalation step.
- If mode is 'meditation', guide them through a calming 4-4-4-4 box breathing exercise.
- Keep response under 150 words so they don't get overwhelmed reading.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    res.json({
      response: "⚡ *Emergency Rescue Override*: I'm catching your breath for you. Let's ignore the big picture for 5 minutes. Put your hands on the keyboard and do just the very first step. You can refine it later!"
    });
  }
});

app.post('/api/generate-steps', async (req, res) => {
  try {
    const { taskTitle, complexity, course } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        steps: [
          { id: 'new-1', text: `Create blank document/file for ${taskTitle}`, done: false, timeEstimate: '1 min' },
          { id: 'new-2', text: 'Write down the exact prompt or requirements', done: false, timeEstimate: '3 mins' },
          { id: 'new-3', text: 'Complete first rough draft of section 1', done: false, timeEstimate: '15 mins' },
          { id: 'new-4', text: 'Quick polish and check guidelines', done: false, timeEstimate: '10 mins' }
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down this academic assignment into 4 to 6 tiny, ultra-low-friction micro-steps that take 2 to 20 minutes each.
Assignment: "${taskTitle}" for course "${course}" (Complexity: ${complexity}).
Return ONLY valid JSON array of objects with keys: "id" (string), "text" (string action item), "done" (boolean false), "timeEstimate" (string like "5 mins").
No markdown codeblocks outside the JSON array if possible, or clean JSON.`
    });

    let raw = response.text || "[]";
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const steps = JSON.parse(raw);
    res.json({ steps });
  } catch (err) {
    console.error('Generate Steps Error:', err);
    res.json({
      steps: [
        { id: 'f-1', text: 'Open the submission portal & review rubric', done: false, timeEstimate: '2 mins' },
        { id: 'f-2', text: 'Write down 3 core bullet points', done: false, timeEstimate: '10 mins' },
        { id: 'f-3', text: 'Flesh out core solutions or paragraphs', done: false, timeEstimate: '20 mins' }
      ]
    });
  }
});

app.post('/api/rescue', async (req, res) => {
  try {
    const { task } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        emailDraft: `Subject: Urgent Extension Request - ${task.title}\n\nDear Professor,\n\nI am writing to respectfully inquire if a 24-hour grace period might be possible for ${task.title}. Due to overlapping project deadlines and an unexpected technical issue, I am striving to ensure my submission meets the high standards of your course.\n\nThank you sincerely for your consideration.\n\nBest regards,\n[Your Name]`,
        scheduleBreakdown: [
          { time: 'Immediate (0m - 10m)', action: 'Triage blockers & drink 1 full glass of water' },
          { time: 'Phase 1 (10m - 35m)', action: `Execute Step 1: ${task.steps?.[0]?.text || 'Initial setup'}` },
          { time: 'Phase 2 (40m - 65m)', action: 'Deep Sprint: Complete core calculations/body text' },
          { time: 'Final (70m - 80m)', action: 'Review submission checklist & upload file' }
        ],
        pepTalk: "Remember: C's get degrees, but right now a B+ is well within reach if you eliminate perfectionism. Done is better than perfect!"
      });
    }

    const prompt = `A student clicked "Rescue Me" for this high-urgency task:
Title: ${task.title}
Course: ${task.course}
Due in: ${task.dueHours} hours
Complexity: ${task.complexity}
Panic Score: ${task.panicScore}/100

Generate a JSON object with 3 keys:
1. "emailDraft": A polite, professional email asking the professor for a 24-hour extension.
2. "scheduleBreakdown": An array of 4 emergency schedule blocks (objects with "time" string and "action" string) to rescue this assignment before deadline.
3. "pepTalk": A 2-sentence adrenaline-calming psychological boost.

Return strictly clean JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    let raw = response.text || "{}";
    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const rescueData = JSON.parse(raw);
    res.json(rescueData);
  } catch (err) {
    res.json({
      emailDraft: `Subject: Extension Request - ${req.body.task?.title || 'Assignment'}\n\nDear Professor,\n\nI am writing to respectfully request a short 24-hour extension on today's assignment due to unforeseen blockers. Thank you for your time and understanding.\n\nBest regards,\n[Student Name]`,
      scheduleBreakdown: [
        { time: 'Right Now', action: 'Breathe in for 4s, hold for 4s, exhale for 6s' },
        { time: 'Next 30 mins', action: 'Complete the easiest micro-step' },
        { time: 'Final Stretch', action: 'Package files and submit' }
      ],
      pepTalk: "Action precedes motivation. Do 5 minutes of ugly work right now!"
    });
  }
});

// Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PanicMode AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
