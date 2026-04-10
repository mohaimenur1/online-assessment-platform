// Mock Users
export const MOCK_EMPLOYER = {
  id: 'emp-1',
  email: 'admin@techcorp.com',
  password: 'admin123',
  name: 'Alex Morgan',
  company: 'TechCorp',
  role: 'employer',
};

export const MOCK_CANDIDATE = {
  id: 'cand-1',
  email: 'john@example.com',
  password: 'pass123',
  name: 'John Doe',
  role: 'candidate',
};

// Mock Exams
export const MOCK_EXAMS = [
  {
    id: 1,
    title: 'Frontend Engineering Assessment',
    candidates: 24,
    questionSets: 3,
    slots: 30,
    duration: 90,
    questions: 5,
    negativeMarking: true,
    startTime: '2026-04-12T10:00',
    endTime: '2026-04-12T18:00',
    status: 'active',
  },
  {
    id: 2,
    title: 'Backend Developer Test',
    candidates: 18,
    questionSets: 2,
    slots: 25,
    duration: 60,
    questions: 3,
    negativeMarking: false,
    startTime: '2026-04-13T09:00',
    endTime: '2026-04-13T17:00',
    status: 'active',
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    candidates: 42,
    questionSets: 4,
    slots: 50,
    duration: 120,
    questions: 30,
    negativeMarking: true,
    startTime: '2026-04-20T11:00',
    endTime: '2026-04-20T19:00',
    status: 'upcoming',
  },
  {
    id: 4,
    title: 'System Design Interview',
    candidates: 12,
    questionSets: 2,
    slots: 15,
    duration: 75,
    questions: 15,
    negativeMarking: false,
    startTime: '2026-04-01T08:00',
    endTime: '2026-04-01T16:00',
    status: 'completed',
  },
];

// Mock Questions per exam
export const MOCK_QUESTIONS = {
  1: [
    {
      id: 1,
      title: 'Which CSS property is used to create a flex container?',
      type: 'radio',
      options: ['display:flex', 'flex:1', 'flexbox:true', 'container:flex'],
      correct: 0,
    },
    {
      id: 2,
      title: 'Select all valid React hooks:',
      type: 'checkbox',
      options: ['useState', 'useEffect', 'useData', 'useRef'],
      correct: [0, 1, 3],
    },
    {
      id: 3,
      title: 'Explain the concept of closure in JavaScript.',
      type: 'text',
      correct: null,
    },
    {
      id: 4,
      title: 'What does the "key" prop in React lists help with?',
      type: 'radio',
      options: ['Styling', 'Performance & reconciliation', 'Authentication', 'Routing'],
      correct: 1,
    },
    {
      id: 5,
      title: 'Which of the following are JavaScript data types?',
      type: 'checkbox',
      options: ['String', 'Boolean', 'Integer', 'Symbol'],
      correct: [0, 1, 3],
    },
  ],
  2: [
    {
      id: 1,
      title: 'What is the time complexity of binary search?',
      type: 'radio',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correct: 1,
    },
    {
      id: 2,
      title: 'Describe RESTful API principles.',
      type: 'text',
      correct: null,
    },
    {
      id: 3,
      title: 'Which HTTP methods are idempotent?',
      type: 'checkbox',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correct: [0, 2, 3],
    },
  ],
};

// Mock Candidates per exam
export const MOCK_CANDIDATES = [
  { id: 1, name: 'Alice Chen', email: 'alice@mail.com', score: 85, status: 'completed', examId: 1, time: '78min' },
  { id: 2, name: 'Bob Smith', email: 'bob@mail.com', score: 72, status: 'completed', examId: 1, time: '90min' },
  { id: 3, name: 'Carol White', email: 'carol@mail.com', score: null, status: 'in-progress', examId: 1, time: '-' },
  { id: 4, name: 'David Lee', email: 'david@mail.com', score: 91, status: 'completed', examId: 1, time: '65min' },
  { id: 5, name: 'Eva Brown', email: 'eva@mail.com', score: null, status: 'not-started', examId: 1, time: '-' },
  { id: 6, name: 'Frank Liu', email: 'frank@mail.com', score: 68, status: 'completed', examId: 2, time: '55min' },
  { id: 7, name: 'Grace Kim', email: 'grace@mail.com', score: 79, status: 'completed', examId: 2, time: '60min' },
];
