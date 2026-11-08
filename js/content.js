/**
 * content.js — All editable text and project data.
 * Change this file to update copy across the site.
 *
 * AUDIENCE: non-technical business owners.
 * Keep language plain and human. No jargon in headlines.
 */

export const content = {
  /* ---- Identity ---- */
  name: 'Zyad Waled',
  title: 'AI Automation for Businesses',

  /* ---- Intro pitch (shown in the "Who I Am" node) ---- */
  pitch:
    'I help small businesses stop losing hours to repetitive work. ' +
    'I design AI-powered automations that connect the tools you already use, ' +
    'like email, messages, spreadsheets and customer support, so routine tasks run on their own.\n\n' +
    'Before automation, I tested real software for global testing platforms, ' +
    'which taught me to spot what breaks before it reaches your customers. ' +
    'I always start by understanding your problem, then build a solution that is reliable and simple to use.',

  /* ---- Small credential line ---- */
  credential:
    'Based in Egypt · Business Information Systems, Capital University · DEPI AI Automation Program',

  /* ---- Projects ---- */
  projects: [
    {
      id: 'inbox-summarizer',
      title: 'Inbox Summarizer',
      problem: 'A crowded inbox hides what matters.',
      built:
        'An assistant that reads incoming emails and turns each one into a short, clear summary, using an AI model that runs on your own computer.',
      outcome:
        'Important emails are spotted in seconds while sensitive messages stay private on your own machine. (Placeholder — final metrics coming soon)',
      stack: ['Python', 'Gmail API', 'Ollama', 'n8n'],
      ctaLabel: 'Discuss a similar project',
      repoUrl: 'https://github.com/zyadwaled780-cmd/gmail-ollama-summarizer',
      image: null, // null → dithered placeholder with "Image coming soon"
      status: 'complete',
    },
    {
      id: 'support-assistant',
      title: 'Customer Support Assistant',
      problem: 'Customers wait for answers to questions that are already in your documents.',
      built:
        'An AI chat assistant that answers customer questions from a company\'s own documents, available any time. Team project.',
      outcome:
        'Customers get instant, accurate answers 24/7 from existing company guides, freeing the team from repetitive questions. (Placeholder — final metrics coming soon)',
      stack: ['Python', 'Ollama', 'Gradio', 'RAG'],
      ctaLabel: 'Discuss a similar project',
      repoUrl: 'https://github.com/samirhanna11/ai-customer-support-agent',
      image: null,
      status: 'complete',
    },
    {
      id: 'project-3',
      title: 'Coming Soon',
      problem: 'A new business automation case study is on the way.',
      built: 'Currently being documented — full walkthrough coming soon.',
      outcome: 'Outcome details coming soon.',
      stack: ['AI Automation', 'n8n'],
      ctaLabel: 'Discuss a similar project',
      repoUrl: null,
      image: null,
      status: 'coming-soon',
    },
    {
      id: 'project-4',
      title: 'Coming Soon',
      problem: 'Another automation workflow in the pipeline.',
      built: 'Currently being documented — full walkthrough coming soon.',
      outcome: 'Outcome details coming soon.',
      stack: ['AI Automation', 'Python'],
      ctaLabel: 'Discuss a similar project',
      repoUrl: null,
      image: null,
      status: 'coming-soon',
    },
  ],

  /* ---- Info & Contact view content (Phase 4) ---- */
  info: {
    subtitle: 'AI Automation for Businesses',
    lead:
      'I help small businesses stop losing hours to repetitive work by connecting the everyday tools they already rely on.',
    paragraphs: [
      'Most businesses do not need complicated new software — they need their existing email, messages, spreadsheets, and customer support documents to work together on their own. I design AI-powered automations so routine tasks happen quietly in the background.',
      'Before automation, I tested real software for global testing platforms, which taught me to spot what breaks before it reaches your customers. I always start by understanding your problem, then build a solution that is reliable and simple for your team to use.',
    ],
    qualifications: [
      {
        label: 'Education',
        value: 'Business Information Systems · Capital University',
      },
      {
        label: 'Program',
        value: 'DEPI AI & Automation Program',
      },
      {
        label: 'Background',
        value: 'Real-World Software Testing on Global Platforms',
      },
      {
        label: 'Base',
        value: 'Egypt · Available for remote projects worldwide',
      },
    ],
    skills: [
      {
        title: 'Email & Inbox Automation',
        detail: 'Turning long threads into clear daily summaries and routing urgent messages.',
      },
      {
        title: 'Document & Support Assistants',
        detail: '24/7 chat assistants that answer customer questions strictly from your own guides.',
      },
      {
        title: 'Connected Business Workflows',
        detail: 'Linking forms, spreadsheets, notifications, and internal tools so nothing falls through the cracks.',
      },
      {
        title: 'Private On-Device AI',
        detail: 'Running AI models on your own computer when business data needs to stay completely private.',
      },
    ],
    tools: ['n8n', 'Python', 'Ollama', 'RAG', 'Gmail API', 'Gradio'],
    contactHeading: 'Let’s Automate Your Busywork',
    contactPitch:
      'Tell me which repetitive task is slowing your business down. I will reply with a clear, practical way we can automate it.',
  },

  /* ---- Digital Twin placeholder (Phase 4) ---- */
  digitalTwin: {
    title: 'Digital Twin',
    subtitle: 'AI Assistant · Coming Soon',
    description:
      'Reserved for a future AI chatbot trained on my work and process — soon you will be able to ask it questions directly.',
    badge: 'Chatbot in development',
  },

  /* ---- Links ---- */
  links: {
    linkedin: 'https://linkedin.com/in/zyad-waled-4048a33a0',
    github: 'https://github.com/zyadwaled780-cmd',
    email: 'hello@example.com', // placeholder
  },
};
