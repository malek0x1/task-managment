

import { generateTeamTemplate } from './openRouter';

export const callAI = async (prompt: string, category?: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {

    if (prompt.includes('Generate a Kanban board')) {
      return generateBoardTemplate(prompt);
    } else if (prompt.includes('summarize')) {
      return "This task involves implementing a user authentication system with email verification and social login options. Priority is high due to security implications.";
    } else if (prompt.includes('metadata')) {
      return {
        priority: 'high',
        dueDate: '2023-05-15',
        tags: ['backend', 'security', 'user-experience']
      };
    } else if (prompt.includes('subtasks')) {
      return [
        "Research authentication providers",
        "Implement email verification flow",
        "Add social login options",
        "Create user profile page",
        "Test login journeys"
      ];
    } else {
      return "I couldn't determine what you needed. Please try a more specific prompt.";
    }
  } catch (error) {
    console.error('Error in AI processing:', error);
    throw new Error('Failed to process AI request');
  }
};

export const generateTaskTitle = async (prompt: string) => {

  await new Promise(resolve => setTimeout(resolve, 800));
  return "Implement User Authentication System";
};

export const summarizeTaskDescription = async (prompt: string) => {

  await new Promise(resolve => setTimeout(resolve, 1000));
  return "This task involves implementing a user authentication system with email verification and social login options. Priority is high due to security implications.";
};

export const suggestTaskMetadata = async (prompt: string) => {

  await new Promise(resolve => setTimeout(resolve, 900));
  return {
    priority: 'high',
    dueDate: '2023-05-15',
    tags: ['backend', 'security', 'user-experience']
  };
};

export const generateSubtasks = async (prompt: string) => {

  await new Promise(resolve => setTimeout(resolve, 1200));
  return [
    "Research authentication providers",
    "Implement email verification flow",
    "Add social login options",
    "Create user profile page",
    "Test login journeys"
  ];
};


export const summarizeBoard = async (prompt?: string) => {

  await new Promise(resolve => setTimeout(resolve, 1200));
  return "Current board has 5 tasks in Backlog, 3 in Progress, and 2 Done. High priority tasks include implementing authentication and database schema design.";
};

export const listBlockedTasks = async () => {

  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    "Create user profile page - Blocked by Database schema",
    "Implement email notifications - Blocked by Auth setup"
  ];
};

export const listOverdueTasks = async () => {

  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    "Set up CI/CD pipeline - Due 2 days ago",
    "Write documentation - Due yesterday"
  ];
};

export const suggestPriorities = async () => {

  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    "Consider raising priority of 'Security audit'",
    "Consider lowering priority of 'UI Animations'"
  ];
};

export const buildPrompt = (type: string, context: any): string => {
  switch (type) {
    case 'task_summary':
      return `Summarize this task: ${JSON.stringify(context)}`;
    case 'generate_subtasks':
      return `Generate subtasks for: ${JSON.stringify(context)}`;
    case 'suggest_metadata':
      return `Suggest metadata for: ${JSON.stringify(context)}`;
    case 'board_summary':
      return `Summarize this board state: ${JSON.stringify(context)}`;
    default:
      return JSON.stringify(context);
  }
};

function generateBoardTemplate(prompt: string) {

  const teamTypeMatch = prompt.match(/'([^']+)'/);
  const teamType = teamTypeMatch ? teamTypeMatch[1] : 'Generic';
  

  if (teamType.toLowerCase().includes('software') || teamType.toLowerCase().includes('development')) {
    return {
      columns: ['Backlog', 'To Do', 'In Progress', 'Testing', 'Done'],
      tasks: [
        {
          title: 'Set up project repository',
          description: 'Initialize the Git repository and set up branch protection rules',
          priority: 'high',
          column: 'Backlog',
          subtasks: [
            { title: 'Create GitHub repository' },
            { title: 'Configure branch protection' }
          ],
          labels: ['infrastructure'],
          assignees: ['Alex']
        },
        {
          title: 'Design database schema',
          description: 'Create database models and relationships diagram',
          priority: 'high',
          column: 'To Do',
          subtasks: [
            { title: 'Identify entity relationships' },
            { title: 'Document schema' }
          ],
          labels: ['backend', 'database'],
          assignees: ['Sam']
        },
        {
          title: 'Implement user authentication',
          description: 'Add login and registration functionality with JWT',
          priority: 'medium',
          column: 'Backlog',
          subtasks: [
            { title: 'Create login API endpoint' },
            { title: 'Create registration API endpoint' }
          ],
          labels: ['backend', 'security'],
          assignees: ['Jamie']
        },
        {
          title: 'Create landing page mockups',
          description: 'Design initial landing page with key features highlighted',
          priority: 'medium',
          column: 'To Do',
          subtasks: [
            { title: 'Design hero section' },
            { title: 'Design features section' }
          ],
          labels: ['frontend', 'design'],
          assignees: ['Taylor']
        }
      ]
    };
  } else if (teamType.toLowerCase().includes('marketing')) {
    return {
      columns: ['Ideas', 'Planning', 'In Progress', 'Review', 'Complete'],
      tasks: [
        {
          title: 'Launch social media campaign',
          description: 'Create and schedule posts for product launch',
          priority: 'high',
          column: 'Planning',
          subtasks: [
            { title: 'Design graphics for posts' },
            { title: 'Write post content' }
          ],
          labels: ['social-media', 'launch'],
          assignees: ['Jordan']
        },
        {
          title: 'Create email newsletter',
          description: 'Design monthly newsletter template and content',
          priority: 'medium',
          column: 'Ideas',
          subtasks: [
            { title: 'Design newsletter template' },
            { title: 'Write main article' }
          ],
          labels: ['email', 'content'],
          assignees: ['Casey']
        }
      ]
    };
  } else {

    return {
      columns: ['Backlog', 'In Progress', 'Done'],
      tasks: [
        {
          title: 'Project kickoff meeting',
          description: 'Schedule and prepare agenda for kickoff meeting',
          priority: 'high',
          column: 'Backlog',
          subtasks: [
            { title: 'Create meeting agenda' },
            { title: 'Send calendar invites' }
          ],
          labels: ['planning'],
          assignees: ['Alex']
        },
        {
          title: 'Define project scope',
          description: 'Document project goals, deliverables, and timeline',
          priority: 'high',
          column: 'Backlog',
          subtasks: [
            { title: 'Interview stakeholders' },
            { title: 'Draft scope document' }
          ],
          labels: ['planning', 'documentation'],
          assignees: ['Jordan']
        }
      ]
    };
  }
}
