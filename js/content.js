/**
 * content.js — Bilingual (English & Arabic) content source of truth.
 * Reconciled directly with Zyad Waled Talat's official CV.
 *
 * Audience: Non-technical potential customers and business owners.
 */

export const CONTACT_INFO = {
  phoneRaw: '+201006889003',
  phoneDisplay: '+20 100 688 9003',
  phoneHref: 'tel:+201006889003',
  whatsappHref: 'https://wa.me/201006889003',
  email: 'zyadwaled780@gmail.com',
  emailHref: 'mailto:zyadwaled780@gmail.com',
  linkedin: 'https://linkedin.com/in/zyad-waled-4048a33a0',
  github: 'https://github.com/zyadwaled780-cmd',
  cvPath: 'assets/Zyad-Waled-Talat-CV.pdf',
  cvFilename: 'Zyad-Waled-Talat-CV.pdf',
  cvWordPath: 'assets/Zyad-Waled-Talat-CV.docx',
  cvWordFilename: 'Zyad-Waled-Talat-CV.docx',
  digitalTwinRepo: 'https://github.com/zyadwaled780-cmd/Digital-Twin-of-Mine-',
};

/**
 * Single-point Digital Twin deployment configuration.
 * Keep secrets (API keys/tokens) in backend hosting env vars only — never in frontend code.
 * Set `liveUrl` to your verified public URL (for example 'https://your-service.onrender.com')
 * once deployed and tested; leave empty until then so no unverified demo link is shown.
 */
export const DIGITAL_TWIN_CONFIG = {
  repoUrl: 'https://github.com/zyadwaled780-cmd/Digital-Twin-of-Mine-',
  liveUrl: 'https://digital-twin-of-mine.vercel.app',
  embedEnabled: true,
};

export const SITE_CONTENT = {
  en: {
    meta: {
      lang: 'en',
      dir: 'ltr',
      homeTitle: 'Zyad Waled Talat — AI and Automation Specialist',
      workTitle: 'Projects & Work — Zyad Waled Talat',
    },
    chooser: {
      badge: 'Welcome · أهلاً بك',
      title: 'Choose Your Language',
      subtitle: 'اختر اللغة المفضلة لتصفح الموقع',
      enLabel: 'English',
      enDesc: 'See how I help businesses lower costs and automate repetitive work.',
      enCta: 'Continue in English →',
      arLabel: 'العربية',
      arDesc: 'اكتشف كيف أساعد الشركات على خفض التكاليف وأتمتة المهام المتكررة.',
      arCta: 'المتابعة بالعربية ←',
    },
    nav: {
      brandName: 'Zyad Waled Talat',
      brandRole: 'AI & Automation Specialist',
      home: 'Home',
      about: 'About',
      services: 'How I Help',
      background: 'Background',
      work: 'Work',
      contact: 'Contact',
      backToHome: '← Back to Home',
      langSwitchLabel: 'العربية',
      langSwitchAria: 'Switch language to Arabic',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeToggleAria: 'Switch between light and dark mode',
      menuOpen: 'Menu',
      menuClose: 'Close',
      menuAria: 'Toggle navigation menu',
    },
    hero: {
      locationBadge: 'AI and Automation Specialist',
      name: 'Zyad Waled Talat',
      headline: 'Help Your Business Lower Costs and Stop Losing Hours to Repetitive Work',
      objective:
        'I help businesses lower costs, improve work efficiency, and automate repetitive tasks that take too much time and effort. Improving your work is my concern, so you don’t have to worry.',
      supporting:
        'Whether your team spends hours answering repeated customer questions, sorting incoming emails, or copying data between tools, I design reliable automations and AI assistants that fit the way you already work.',
      ctaCall: 'Call Me',
      ctaWhatsapp: 'WhatsApp Me',
      ctaEmail: 'Email Me',
      ctaCv: 'Download CV (PDF)',
      ctaCvWord: 'Download CV (Word)',
      ctaWork: 'View My Work →',
      quickFacts: [
        {
          label: 'Focus',
          value: 'Cost Reduction & Workflow Efficiency',
        },
        {
          label: 'Background',
          value: 'Business Information Systems & Software Quality Testing',
        },
        {
          label: 'Location',
          value: '6th of October City, Egypt (Available Remotely)',
        },
      ],
    },
    about: {
      eyebrow: 'About Me',
      title: 'A Business-First Approach to AI and Automation',
      lead:
        'Most businesses do not need complicated new systems—they need their everyday tools to work together smoothly and reliably.',
      paragraphs: [
        'I study Business Information Systems (BIS) at the Faculty of Commerce, Capital University, where I focus on bridging business operations with practical technology. I combine that business foundation with specialized training in the Digital Egypt Pioneers Initiative AI & Automation track.',
        'Before building automations, I worked as a Software Tester on UTest and as an AI Data Annotator on Outlier. Testing real client applications and evaluating AI outputs taught me how to spot edge cases early, ensure accuracy, and deliver tools that your team and customers can rely on.',
      ],
      pillarsTitle: 'Why Work With Me',
      pillars: [
        {
          title: 'Active Listening First',
          desc: 'I start by understanding your actual daily bottlenecks and business goals before suggesting any tool.',
        },
        {
          title: 'Tested for Reliability',
          desc: 'My background in software testing means I check what could go wrong before an automation reaches your customers.',
        },
        {
          title: 'Clear & Simple to Use',
          desc: 'No confusing dashboards or technical jargon—your team gets straightforward workflows that save time from day one.',
        },
        {
          title: 'Attention to Detail & Patience',
          desc: 'Careful handling of your business data, edge cases, and customer experience at every step.',
        },
      ],
    },
    services: {
      eyebrow: 'How I Can Help',
      title: 'Practical Solutions Focused on Business Results',
      subtitle:
        'Every service is designed around a clear customer benefit: saving time, reducing operating costs, and improving response speed.',
      items: [
        {
          title: 'Workflow & Task Automation',
          benefit: 'Save hours of manual data entry and routine follow-ups every week.',
          desc: 'Connect the tools you already use—such as email, spreadsheets, databases, and notifications—using n8n and Python so routine tasks happen automatically without human error.',
        },
        {
          title: 'AI Customer Support Assistants',
          benefit: 'Give customers instant, accurate answers 24/7 from your own documents.',
          desc: 'Build custom chat assistants powered by Retrieval-Augmented Generation (RAG) that answer questions strictly from your approved company guides, freeing your staff for high-value work.',
        },
        {
          title: 'Smart Email & Document Summarization',
          benefit: 'Spot urgent messages in seconds while keeping sensitive data private.',
          desc: 'Automatically summarize incoming emails and long reports into clear action points—including private AI setups (using Ollama) that run locally on your own computer.',
        },
        {
          title: 'Connected Business Apps & Databases',
          benefit: 'Organize business information cleanly across web and mobile.',
          desc: 'Build and connect structured databases (SQL, Supabase) and cross-platform interfaces (JavaScript, Dart, Flutter) tailored to your team’s daily workflow.',
        },
      ],
      workBannerTitle: 'Want to see real examples of these solutions?',
      workBannerDesc:
        'Explore my completed projects and optional interactive workflow showcase on a dedicated page.',
      workBannerCta: 'View Projects →',
    },
    featuredTwin: {
      eyebrow: 'Featured Project',
      title: 'AI Digital Twin',
      description:
        'A conversational AI experience that lets visitors learn about my background, skills, and projects — powered by strict CV-only retrieval (RAG), bilingual English & Egyptian Arabic support, and Telegram notification forwarding.',
      highlights: [
        'Grounded answers sourced strictly from verified CV data',
        'Supports English and Egyptian Arabic with accurate RTL/LTR handling',
        'Forwards visitor follow-ups and unanswered questions via Telegram',
      ],
      stack: ['Python', 'Gradio', 'Groq API', 'RAG', 'Telegram Bot'],
      viewCodeLabel: 'View Code',
      chatCtaLabel: 'Chat with My Digital Twin',
      openNewTabLabel: 'Open in new tab ↗',
      comingSoonLabel: 'Live demo coming soon',
      comingSoonNote:
        'The chatbot service is configured for cloud deployment and will be enabled here once its public URL is live.',
    },
    background: {
      eyebrow: 'Background & Credentials',
      title: 'Education, Experience, and Certifications',
      subtitle:
        'Verified factual background from my curriculum vitae.',
      cvCta: 'Download CV (PDF)',
      cvWordCta: 'Download CV (Word)',
      educationTitle: 'Education',
      education: {
        degree: 'Bachelor of Business Information Systems (BIS)',
        institution: 'Faculty of Commerce, Capital University',
        details: 'Second Year · Expected Graduation: 2028 · GPA: 3.4',
      },
      experienceTitle: 'Professional Experience',
      experience: [
        {
          role: 'Software Tester',
          company: 'UTest',
          desc: 'Performed software testing and bug reporting for client applications to ensure quality and reliability.',
        },
        {
          role: 'AI Data Annotator',
          company: 'Outlier',
          desc: 'Conducted AI data annotation and evaluation tasks to improve model accuracy and response quality.',
        },
      ],
      coursesTitle: 'Courses & Certifications',
      courses: [
        {
          name: 'Digital Egypt Pioneers Initiative AI & Automation track',
          issuer: 'Eyouth · Digital Egypt Pioneers Initiative (DEPI)',
          period: 'Current Track',
        },
        {
          name: 'Forward Program',
          issuer: 'McKinsey & Company',
          period: '2025 / 2026',
        },
        {
          name: 'Artificial Intelligence Fundamentals',
          issuer: 'IBM SkillsBuild',
          period: '2025 / 2026',
        },
        {
          name: 'Customer Experience (CX) for Business Success',
          issuer: 'HP LIFE',
          period: '2024 / 2025',
        },
        {
          name: 'GCI World 2026 September',
          issuer: 'Matsuo-Iwasawa Laboratory',
          period: '2026',
        },
      ],
      skillsTitle: 'Skills & Tools',
      techSkillsLabel: 'Technical Skills',
      techSkills: [
        'n8n',
        'SQL',
        'Supabase',
        'Ollama',
        'Hugging Face',
        'Git / GitHub',
        'Docker',
        'RAG (Retrieval-Augmented Generation)',
        'Python',
        'JavaScript',
        'Dart',
        'Flutter',
      ],
      softSkillsLabel: 'Professional & Soft Skills',
      softSkills: [
        'Active Listening',
        'Problem Solving',
        'Patience',
        'Attention to Detail',
        'Adaptability',
      ],
    },
    contact: {
      eyebrow: 'Contact Me',
      title: 'Let’s Discuss How to Improve Your Workflow',
      lead:
        'Tell me which repetitive task is taking up your team’s time and budget. You can call me directly or send an email, and I will reply with a clear, practical way to help.',
      callCta: 'Call Me',
      whatsappCta: 'WhatsApp Me',
      emailCta: 'Email Me',
      cvCta: 'Download CV (PDF)',
      cvWordCta: 'Download CV (Word)',
      phoneLabel: 'Phone',
      whatsappLabel: 'WhatsApp',
      whatsappAction: 'Chat on WhatsApp ↗',
      emailLabel: 'Email',
      locationLabel: 'Location',
      locationValue: '6th of October City, Egypt',
      linkedinLabel: 'LinkedIn',
      linkedinAction: 'View LinkedIn Profile ↗',
      githubLabel: 'GitHub',
      githubAction: 'View GitHub Repositories ↗',
      copyEmail: 'Copy Email',
      copiedEmail: 'Copied!',
    },
    workPage: {
      eyebrow: 'Projects & Case Studies',
      title: 'Selected Work & Practical Automations',
      lead:
        'Every project below solves a practical problem—from answering customer questions automatically to summarizing crowded email inboxes and building AI learning tools.',
      backHomeCta: '← Back to Homepage',
      contactCta: 'Discuss a Similar Project',
      problemLabel: 'Business Problem',
      builtLabel: 'What Was Built',
      benefitLabel: 'Customer Benefit',
      toolsLabel: 'Tools Used',
      repoLinkLabel: 'View Project on GitHub ↗',
      viewCodeLabel: 'View Code',
      featuredBadge: 'Featured Project',
      chatCtaLabel: 'Chat with My Digital Twin',
      openNewTabLabel: 'Open in new tab ↗',
      liveDemoSoon: 'Live demo coming soon',
      statusComplete: 'Completed Project',
      statusInDev: 'In Development',
      canvasSectionTitle: 'Optional: Interactive Automation Workflow View',
      canvasSectionDesc:
        'Want to see how an automation workflow runs step by step? Click "Execute Workflow" below to explore the interactive n8n-style canvas.',
      projects: [
        {
          id: 'digital-twin',
          title: 'AI Digital Twin',
          featured: true,
          status: 'in-dev',
          problem:
            'Visitors and potential clients want immediate answers about my background, skills, and projects outside regular hours without hunting through static pages.',
          built:
            'A conversational AI experience built with Python, Gradio, Groq, and strict CV-only RAG that lets visitors explore my background, skills, and projects in English or Egyptian Arabic, while forwarding contact requests via Telegram.',
          benefit:
            'Delivers accurate, verifiable Q&A around the clock while capturing genuine visitor inquiries seamlessly.',
          stack: ['Python', 'Gradio', 'Groq API', 'RAG', 'Telegram Bot'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/Digital-Twin-of-Mine-',
        },
        {
          id: 'support-assistant',
          title: 'AI Customer Support Agent',
          status: 'complete',
          problem:
            'Customers wait too long for answers to common questions that are already written in company documents.',
          built:
            'An AI chat assistant using Retrieval-Augmented Generation (RAG) and a clean Gradio chat interface that answers questions strictly from a company’s own knowledge base. (Team project)',
          benefit:
            'Delivers instant, accurate answers 24/7 while freeing support staff from repetitive inquiries.',
          stack: ['Python', 'Ollama', 'Gradio', 'RAG'],
          repoUrl: 'https://github.com/samirhanna11/ai-customer-support-agent',
        },
        {
          id: 'inbox-summarizer',
          title: 'Inbox Summarizer (Gmail & Local AI)',
          status: 'complete',
          problem:
            'A crowded email inbox hides urgent client messages and wastes time every morning.',
          built:
            'An automated workflow that connects Gmail to a local Ollama AI model (phi3:mini) to read incoming emails and turn each one into a short, clear summary—built first in Python and then as an n8n workflow.',
          benefit:
            'Highlights key decisions in seconds while keeping sensitive business emails 100% private on your own computer.',
          stack: ['n8n', 'Python', 'Gmail API', 'Ollama'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/gmail-ollama-summarizer',
        },
        {
          id: 'ai-learning-app',
          title: 'AI Learning Application',
          status: 'complete',
          problem:
            'Learners and teams need structured, accessible ways to practice and adopt new concepts.',
          built:
            'An application built to support interactive AI-assisted learning and skill development.',
          benefit:
            'Makes complex topics easier to follow through a clean, user-friendly application interface.',
          stack: ['Dart', 'Flutter', 'AI Integration'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/AI-Learning-app',
        },
        {
          id: 'portfolio-project',
          title: 'Bilingual Customer & Workflow Portfolio',
          status: 'complete',
          problem:
            'Potential clients need a fast, clear way to evaluate credentials, understand business value, and make contact in English or Arabic.',
          built:
            'This bilingual (English & Arabic) portfolio with light/dark themes, high-contrast typography, and an optional interactive automation canvas.',
          benefit:
            'Makes it effortless for business owners to review services, download the CV, or call and email directly.',
          stack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/portfolio',
        },
      ],
    },
    digitalTwin: {
      launcherLabel: 'AI Digital Twin',
      statusBadgeSoon: 'Live demo coming soon',
      statusBadgeLive: 'Chat live',
      panelTitle: 'AI Digital Twin',
      panelSubtitleSoon: 'Live demo coming soon',
      panelSubtitleLive: 'Conversational CV Assistant',
      descriptionSoon:
        'A conversational AI experience that lets visitors learn about my background, skills, and projects. The hosted live demo is coming soon once public cloud deployment is active.',
      descriptionDirect:
        'Open the live AI Digital Twin assistant in a new browser tab to ask about my background, skills, and projects in English or Arabic.',
      noteSoon:
        'Meanwhile, you can explore the source code or reach me directly:',
      iframeTitle: 'Zyad Waled Talat — AI Digital Twin Chat',
      loadingText: 'Waking up the AI Digital Twin… First load on free cloud hosting can take 30–60 seconds.',
      slowLoadHint: 'Taking longer than usual? You can open the full chat directly in a new tab:',
      chatCtaLabel: 'Chat with My Digital Twin',
      openNewTabLabel: 'Open in new tab ↗',
      viewCodeLabel: 'View Code',
      minimizeAria: 'Minimize AI Digital Twin panel',
      closeAria: 'Close AI Digital Twin panel',
      openAriaSoon: 'Open AI Digital Twin panel (Live demo coming soon)',
      openAriaLive: 'Chat with My Digital Twin',
    },
    footer: {
      copyright: '© Zyad Waled Talat · AI and Automation Specialist · 6th of October City, Egypt',
      workLink: 'View Projects',
      homeLink: 'Home',
      cvLink: 'Download CV (PDF)',
      cvWordLink: 'Download CV (Word)',
    },
  },

  ar: {
    meta: {
      lang: 'ar',
      dir: 'rtl',
      homeTitle: 'زياد وليد طلعت — أخصائي الذكاء الاصطناعي والأتمتة',
      workTitle: 'المشاريع والأعمال — زياد وليد طلعت',
    },
    chooser: {
      badge: 'أهلاً بك · Welcome',
      title: 'اختر اللغة المفضلة',
      subtitle: 'Choose your preferred language to enter the portfolio',
      enLabel: 'English',
      enDesc: 'See how I help businesses lower costs and automate repetitive work.',
      enCta: 'Continue in English →',
      arLabel: 'العربية',
      arDesc: 'اكتشف كيف أساعد الشركات على خفض التكاليف وأتمتة المهام المتكررة.',
      arCta: 'المتابعة بالعربية ←',
    },
    nav: {
      brandName: 'زياد وليد طلعت',
      brandRole: 'أخصائي الذكاء الاصطناعي والأتمتة',
      home: 'الرئيسية',
      about: 'من أنا',
      services: 'كيف أساعدك',
      background: 'المؤهلات والخبرات',
      work: 'أعمالي',
      contact: 'تواصل معي',
      backToHome: '→ العودة إلى الرئيسية',
      langSwitchLabel: 'English',
      langSwitchAria: 'تغيير اللغة إلى الإنجليزية',
      themeLight: 'فاتح',
      themeDark: 'داكن',
      themeToggleAria: 'التبديل بين الوضع الفاتح والداكن',
      menuOpen: 'القائمة',
      menuClose: 'إغلاق',
      menuAria: 'فتح أو إغلاق قائمة التنقل',
    },
    hero: {
      locationBadge: 'أخصائي الذكاء الاصطناعي والأتمتة',
      name: 'زياد وليد طلعت',
      headline: 'اخفض تكاليف أعمالك وتوقف عن إهدار الساعات في المهام المتكررة',
      objective:
        'أساعد الشركات وأصحاب الأعمال على خفض التكاليف، ورفع كفاءة العمل، وأتمتة المهام المتكررة التي تستهلك الكثير من الوقت والتكلفة. تحسين سير عملك هو اهتمامي الأول، حتى لا تضطر للقلق.',
      supporting:
        'سواء كان فريقك يقضي ساعات في الرد على أسئلة العملاء المتكررة، أو فرز رسائل البريد الإلكتروني، أو نقل البيانات يدوياً بين الأدوات المختلفة، أصمم لك حلول أتمتة ومساعدين أذكياء يعملون بسلاسة مع الأدوات التي تستخدمها بالفعل.',
      ctaCall: 'اتصل بي',
      ctaWhatsapp: 'تواصل عبر واتساب',
      ctaEmail: 'راسلني عبر البريد',
      ctaCv: 'تحميل السيرة الذاتية (PDF)',
      ctaCvWord: 'تحميل السيرة الذاتية (Word)',
      ctaWork: 'تصفح أعمالي ←',
      quickFacts: [
        {
          label: 'التركيز الأساسي',
          value: 'خفض التكاليف ورفع كفاءة سير العمل',
        },
        {
          label: 'الخلفية العلمية والمهنية',
          value: 'نظم معلومات الأعمال واختبار جودة البرمجيات',
        },
        {
          label: 'الموقع',
          value: 'مدينة 6 أكتوبر، مصر (متاح للعمل عن بُعد)',
        },
      ],
    },
    about: {
      eyebrow: 'من أنا',
      title: 'رؤية عملية تضع احتياجات عملك قبل التعقيد التقني',
      lead:
        'معظم الشركات لا تحتاج إلى أنظمة جديدة معقدة، بل تحتاج إلى ربط أدواتها اليومية لتعمل معاً بدقة وموثوقية.',
      paragraphs: [
        'أدرس نظم معلومات الأعمال (BIS) في كلية التجارة بجامعة العاصمة (Capital University)، حيث أركز على توظيف التكنولوجيا لخدمة العمليات التجارية الفعالة، إلى جانب تدريبي المتخصص في مبادرة رواد مصر الرقمية — مسار الذكاء الاصطناعي والأتمتة.',
        'قبل تصميم حلول الأتمتة، عملت مختبِراً للبرمجيات (Software Tester) على منصة UTest، ومُقيِّماً لبيانات الذكاء الاصطناعي (AI Data Annotator) على منصة Outlier. هذه الخبرة العملية علمتني اكتشاف الأخطاء مبكراً قبل وصولها إلى عملائك، وتقديم حلول دقيقة يعتمد عليها فريقك بكل ثقة.',
      ],
      pillarsTitle: 'لماذا تعمل معي؟',
      pillars: [
        {
          title: 'الاستماع الجيد لفهم المشكلة',
          desc: 'أبدأ دائماً بفهم تفاصيل عملك اليومية والمشكلات التي تبطئ فريقك قبل اقتراح أي أداة.',
        },
        {
          title: 'اختبار دقيق للموثوقية',
          desc: 'خبرتي في اختبار البرمجيات تضمن فحص كل خطوة في النظام للتأكد من عمله دون أعطال.',
        },
        {
          title: 'حلول واضحة وسهلة الاستخدام',
          desc: 'لا توجد واجهات معقدة أو مصطلحات تقنية مربكة؛ يحصل فريقك على نظام بسيط يوفر الوقت منذ اليوم الأول.',
        },
        {
          title: 'الاهتمام بالتفاصيل والمرونة',
          desc: 'عناية فائقة ببيانات عملك وتجربة عملائك مع مرونة كاملة لتكييف الحل مع نمو شركتك.',
        },
      ],
    },
    services: {
      eyebrow: 'كيف يمكنني مساعدتك',
      title: 'حلول عملية مصممة لتحقيق نتائج ملموسة لأعمالك',
      subtitle:
        'كل خدمة مصممة حول فائدة واضحة لعملك: توفير الوقت، وخفض تكاليف التشغيل، وتسريع خدمة عملائك.',
      items: [
        {
          title: 'أتمتة المهام وسير العمل اليومي',
          benefit: 'وفّر ساعات من إدخال البيانات اليدوي والمتابعات الروتينية كل أسبوع.',
          desc: 'ربط الأدوات التي تستخدمها يومياً — مثل البريد الإلكتروني، وجداول البيانات، وقواعد البيانات، والإشعارات — باستخدام n8n وPython لتعمل المهام الروتينية تلقائياً دون أخطاء بشرية.',
        },
        {
          title: 'مساعدو خدمة العملاء بالذكاء الاصطناعي',
          benefit: 'امنح عملاءك إجابات فورية ودقيقة على مدار الساعة من مستندات شركتك.',
          desc: 'بناء مساعد محادثة ذكي يعتمد على تقنية الاسترجاع المعزز (RAG) للإجابة عن استفسارات العملاء بالاعتماد الحصري على أدلة وملفات شركتك المعتمدة، مما يخفف العبء عن فريقك.',
        },
        {
          title: 'تلخيص البريد الإلكتروني والمستندات تلقائياً',
          benefit: 'اطّلع على الرسائل المهمة في ثوانٍ مع الحفاظ التام على سرية بياناتك.',
          desc: 'تحويل رسائل البريد الطويلة والتقارير إلى ملخصات واضحة ومختصرة، مع إمكانية تشغيل نموذج الذكاء الاصطناعي محلياً على جهازك الخاص (عبر Ollama) لحماية خصوصية بياناتك.',
        },
        {
          title: 'تطبيقات وقواعد بيانات مترابطة للأعمال',
          benefit: 'تنظيم بيانات العمل بوضوح عبر الويب والهاتف المحمول.',
          desc: 'تصميم وربط قواعد البيانات المنظمة (SQL وSupabase) وواجهات الاستخدام السلسة (JavaScript وDart وFlutter) بما يتناسب مع احتياجات فريقك.',
        },
      ],
      workBannerTitle: 'هل ترغب في رؤية أمثلة عملية لهذه الحلول؟',
      workBannerDesc:
        'استعرض مشاريعي المنفذة وتجربة سير العمل التفاعلية في صفحة الأعمال المخصصة.',
      workBannerCta: 'استعرض المشاريع ←',
    },
    featuredTwin: {
      eyebrow: 'مشروع مميز',
      title: 'التوأم الرقمي بالذكاء الاصطناعي (AI Digital Twin)',
      description:
        'تجربة محادثة تفاعلية بالذكاء الاصطناعي تتيح للزوار استكشاف خلفيتي المهنية ومهاراتي ومشاريعي باللغتين العربية والإنجليزية بالاعتماد الحصري على بيانات السيرة الذاتية مع إرسال الاستفسارات عبر Telegram.',
      highlights: [
        'إجابات دقيقة مبنية حصرياً على السيرة الذاتية المعتمدة',
        'دعم كامل للغتين العربية المصرية والإنجليزية مع معالجة RTL/LTR',
        'تسجيل طلبات التواصل والأسئلة غير المغطاة عبر بوت Telegram',
      ],
      stack: ['Python', 'Gradio', 'Groq API', 'RAG', 'Telegram Bot'],
      viewCodeLabel: 'عرض الكود',
      chatCtaLabel: 'تحدث مع التوأم الرقمي',
      openNewTabLabel: 'فتح في تبويب جديد ↗',
      comingSoonLabel: 'العرض المباشر قريباً',
      comingSoonNote:
        'المشروع مهيأ للاستضافة السحابية وسيتم تفعيل رابط المحادثة المباشر هنا فور نشره.',
    },
    background: {
      eyebrow: 'المؤهلات والخبرات',
      title: 'التعليم، والخبرة المهنية، والشهادات المعتمدة',
      subtitle:
        'بيانات موثقة مطابقة للسيرة الذاتية الرسمية.',
      cvCta: 'تحميل السيرة الذاتية (PDF)',
      cvWordCta: 'تحميل السيرة الذاتية (Word)',
      educationTitle: 'التعليم الجامعي',
      education: {
        degree: 'بكالوريوس نظم معلومات الأعمال — BIS',
        institution: 'كلية التجارة، جامعة العاصمة — Capital University',
        details: 'الفرقة الثانية · التخرج المتوقع: 2028 · المعدل التراكمي: 3.4',
      },
      experienceTitle: 'الخبرة المهنية',
      experience: [
        {
          role: 'مختبِر جودة البرمجيات — Software Tester',
          company: 'UTest',
          desc: 'إجراء اختبارات الجودة واكتشاف الأعطال وإعداد تقارير الأخطاء لتطبيقات العملاء لضمان كفاءة الأداء.',
        },
        {
          role: 'مُقيِّم ومُصنِّف بيانات الذكاء الاصطناعي — AI Data Annotator',
          company: 'Outlier',
          desc: 'تنفيذ مهام تصنيف وتقييم بيانات ومخرجات نماذج الذكاء الاصطناعي لرفع دقتها وجودة استجابتها.',
        },
      ],
      coursesTitle: 'الدورات التدريبية والشهادات',
      courses: [
        {
          name: 'مبادرة رواد مصر الرقمية — مسار الذكاء الاصطناعي والأتمتة',
          issuer: 'Eyouth · Digital Egypt Pioneers Initiative AI & Automation track',
          period: 'المسار الحالي',
        },
        {
          name: 'برنامج ماكينزي لتطوير المهارات المهنية — Forward Program',
          issuer: 'McKinsey & Company',
          period: '2025 / 2026',
        },
        {
          name: 'أساسيات الذكاء الاصطناعي — AI Fundamentals',
          issuer: 'IBM SkillsBuild',
          period: '2025 / 2026',
        },
        {
          name: 'تجربة العملاء لنجاح الأعمال — Customer Experience (CX)',
          issuer: 'HP LIFE',
          period: '2024 / 2025',
        },
        {
          name: 'برنامج GCI World — سبتمبر 2026',
          issuer: 'Matsuo-Iwasawa Laboratory',
          period: '2026',
        },
      ],
      skillsTitle: 'المهارات والأدوات',
      techSkillsLabel: 'المهارات التقنية',
      techSkills: [
        'n8n',
        'SQL',
        'Supabase',
        'Ollama',
        'Hugging Face',
        'Git / GitHub',
        'Docker',
        'RAG (Retrieval-Augmented Generation)',
        'Python',
        'JavaScript',
        'Dart',
        'Flutter',
      ],
      softSkillsLabel: 'المهارات المهنية والشخصية',
      softSkills: [
        'الاستماع الفعّال',
        'حل المشكلات',
        'الصبر والتأني',
        'الاهتمام بالتفاصيل',
        'المرونة وسرعة التكيف',
      ],
    },
    contact: {
      eyebrow: 'تواصل معي',
      title: 'لنتحدث حول كيفية تطوير وأتمتة سير عملك',
      lead:
        'أخبرني بالمهمة المتكررة التي تستهلك وقت فريقك أو ميزانيتك. يمكنك الاتصال بي مباشرة أو مراسلتي عبر البريد الإلكتروني، وسأرد عليك بخطوات عملية وواضحة.',
      callCta: 'اتصل بي الآن',
      whatsappCta: 'تواصل عبر واتساب',
      emailCta: 'راسلني عبر البريد',
      cvCta: 'تحميل السيرة الذاتية (PDF)',
      cvWordCta: 'تحميل السيرة الذاتية (Word)',
      phoneLabel: 'رقم الهاتف',
      whatsappLabel: 'واتساب (WhatsApp)',
      whatsappAction: 'بدء محادثة عبر واتساب ↗',
      emailLabel: 'البريد الإلكتروني',
      locationLabel: 'الموقع',
      locationValue: 'مدينة 6 أكتوبر، مصر',
      linkedinLabel: 'لينكدإن (LinkedIn)',
      linkedinAction: 'زيارة الملف الشخصي على LinkedIn ↗',
      githubLabel: 'جيت هب (GitHub)',
      githubAction: 'تصفح المشاريع على GitHub ↗',
      copyEmail: 'نسخ البريد الإلكتروني',
      copiedEmail: 'تم النسخ!',
    },
    workPage: {
      eyebrow: 'المشاريع ونماذج الأعمال',
      title: 'أعمال مختارة وحلول أتمتة عملية',
      lead:
        'كل مشروع من المشاريع التالية يعالج مشكلة حقيقية — بدءاً من الرد التلقائي على استفسارات العملاء وحتى تلخيص البريد الإلكتروني المزدحم وبناء تطبيقات التعلم الذكية.',
      backHomeCta: '→ العودة إلى الصفحة الرئيسية',
      contactCta: 'ناقش مشروعاً مشابهاً',
      problemLabel: 'المشكلة في العمل',
      builtLabel: 'الحل الذي تم بناؤه',
      benefitLabel: 'الفائدة للعميل',
      toolsLabel: 'الأدوات المستخدمة',
      repoLinkLabel: 'عرض المشروع على GitHub ↗',
      viewCodeLabel: 'عرض الكود',
      featuredBadge: 'مشروع مميز',
      chatCtaLabel: 'تحدث مع التوأم الرقمي',
      openNewTabLabel: 'فتح في تبويب جديد ↗',
      liveDemoSoon: 'العرض المباشر قريباً',
      statusComplete: 'مشروع مكتمل',
      statusInDev: 'قيد التطوير',
      canvasSectionTitle: 'اختياري: استعراض مخطط سير العمل التفاعلي',
      canvasSectionDesc:
        'هل ترغب في تجربة كيف يعمل مسار الأتمتة خطوة بخطوة؟ اضغط على زر التشغيل أدناه لاستكشاف لوحة سير العمل التفاعلية.',
      projects: [
        {
          id: 'digital-twin',
          title: 'التوأم الرقمي بالذكاء الاصطناعي (AI Digital Twin)',
          featured: true,
          status: 'in-dev',
          problem:
            'يحتاج الزوار والعملاء المحتملون إلى إجابات فورية وموثوقة عن الخلفية المهنية والمهارات والمشاريع في أي وقت.',
          built:
            'مساعد محادثة بالذكاء الاصطناعي مبني بـ Python وGradio وGroq واسترجاع CV-Only RAG، يتيح للزوار السؤال بالعربية المصرية أو الإنجليزية ويرسل طلبات المتابعة عبر Telegram.',
          benefit:
            'يوفر محادثة تفاعلية متاحة دائماً تعتمد على حقائق السيرة الذاتية فقط وتسهل بدء التواصل المباشر.',
          stack: ['Python', 'Gradio', 'Groq API', 'RAG', 'Telegram Bot'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/Digital-Twin-of-Mine-',
        },
        {
          id: 'support-assistant',
          title: 'مساعد خدمة العملاء بالذكاء الاصطناعي',
          status: 'complete',
          problem:
            'انتظار العملاء لفترات طويلة للحصول على إجابات لأسئلة متكررة موجودة بالفعل داخل مستندات الشركة.',
          built:
            'مساعد محادثة ذكي يعتمد على تقنية الاسترجاع المعزز للمعلومات (RAG) مع واجهة محادثة سهلة الاستخدام عبر Gradio للإجابة عن أسئلة العملاء من قاعدة معرفة الشركة. (مشروع جماعي)',
          benefit:
            'تقديم إجابات فورية ودقيقة على مدار الساعة، وتفرغ فريق الدعم للمهام الأكثر أهمية.',
          stack: ['Python', 'Ollama', 'Gradio', 'RAG'],
          repoUrl: 'https://github.com/samirhanna11/ai-customer-support-agent',
        },
        {
          id: 'inbox-summarizer',
          title: 'ملخِّص البريد الإلكتروني الذكي',
          status: 'complete',
          problem:
            'ازدحام صندوق البريد الإلكتروني يخفي الرسائل العاجلة ويستهلك وقتاً طويلاً في القراءة والفرز يومياً.',
          built:
            'مسار عمل مؤتمت يربط بريد Gmail بنموذج ذكاء اصطناعي محلي عبر Ollama لقراءة الرسائل الواردة وتحويل كل رسالة إلى ملخص قصير وواضح — تم بناؤه بلغة Python ثم كمسار أتمتة على n8n.',
          benefit:
            'معرفة النقاط المهمة في ثوانٍ معدودة مع الحفاظ على خصوصية الرسائل بالكامل على جهازك.',
          stack: ['n8n', 'Python', 'Gmail API', 'Ollama'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/gmail-ollama-summarizer',
        },
        {
          id: 'ai-learning-app',
          title: 'تطبيق التعلم الذكي',
          status: 'complete',
          problem:
            'الحاجة إلى تطبيق عملي وسهل الاستخدام لتنظيم عملية التعلم وتطوير المهارات.',
          built:
            'تطبيق تفاعلي يدعم التعلم وتطوير المهارات بمساعدة الذكاء الاصطناعي.',
          benefit:
            'تبسيط المفاهيم وتقديم تجربة استخدام سلسة وواضحة عبر واجهة حديثة.',
          stack: ['Dart', 'Flutter', 'AI Integration'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/AI-Learning-app',
        },
        {
          id: 'portfolio-project',
          title: 'معرض الأعمال الثنائي اللغة ومخطط الأتمتة التفاعلي',
          status: 'complete',
          problem:
            'حاجة أصحاب الأعمال إلى طريقة واضحة وسريعة للتعرف على الخدمات والمؤهلات والتواصل المباشر باللغتين العربية والإنجليزية.',
          built:
            'هذا الموقع الثنائي اللغة (عربي / إنجليزي) مع الوضعين الفاتح والداكن، والخطوط العربية والإنجليزية الواضحة، ولوحة سير العمل التفاعلية.',
          benefit:
            'تمكين العملاء من استعراض الخدمات أو تحميل السيرة الذاتية أو الاتصال المباشر بكل سهولة.',
          stack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
          repoUrl: 'https://github.com/zyadwaled780-cmd/portfolio',
        },
      ],
    },
    digitalTwin: {
      launcherLabel: 'التوأم الرقمي',
      statusBadgeSoon: 'العرض المباشر قريباً',
      statusBadgeLive: 'متاح الآن',
      panelTitle: 'التوأم الرقمي بالذكاء الاصطناعي',
      panelSubtitleSoon: 'العرض المباشر قريباً',
      panelSubtitleLive: 'مساعد محادثة السيرة الذاتية',
      descriptionSoon:
        'تجربة محادثة بالذكاء الاصطناعي تتيح للزوار معرفة المزيد عن خلفيتي ومهاراتي ومشاريعي. العرض المباشر قيد التجهيز للنشر السحابي.',
      descriptionDirect:
        'افتح التوأم الرقمي في تبويب جديد لطرح الأسئلة حول خبراتي ومهاراتي ومشاريعي بالعربية أو الإنجليزية.',
      noteSoon:
        'في الوقت الحالي يمكنك استعراض الكود المصدري أو التواصل معي مباشرة:',
      iframeTitle: 'زياد وليد طلعت — محادثة التوأم الرقمي بالذكاء الاصطناعي',
      loadingText: 'جارٍ تشغيل التوأم الرقمي… قد يستغرق التحميل الأول على الاستضافة المجانية ٣٠–٦٠ ثانية.',
      slowLoadHint: 'هل استغرق التحميل وقتاً أطول من المعتاد؟ يمكنك فتح المحادثة مباشرة في تبويب جديد:',
      chatCtaLabel: 'تحدث مع التوأم الرقمي',
      openNewTabLabel: 'فتح في تبويب جديد ↗',
      viewCodeLabel: 'عرض الكود',
      minimizeAria: 'تصغير نافذة التوأم الرقمي',
      closeAria: 'إغلاق نافذة التوأم الرقمي',
      openAriaSoon: 'فتح نافذة التوأم الرقمي (العرض المباشر قريباً)',
      openAriaLive: 'تحدث مع التوأم الرقمي',
    },
    footer: {
      copyright: '© زياد وليد طلعت · أخصائي الذكاء الاصطناعي والأتمتة · مدينة 6 أكتوبر، مصر',
      workLink: 'تصفح المشاريع',
      homeLink: 'الرئيسية',
      cvLink: 'تحميل السيرة الذاتية (PDF)',
      cvWordLink: 'تحميل السيرة الذاتية (Word)',
    },
  },
};

/**
 * Legacy export `content` preserved so the optional interactive workflow canvas
 * on work.html continues working without breaking any existing module imports.
 */
export const content = {
  name: 'Zyad Waled Talat',
  title: 'AI and Automation Specialist',
  pitch:
    'I help businesses lower costs, improve work efficiency, and automate repetitive tasks that take much time and cost.\n\n' +
    'Improving your work is my concern, so you don\'t have to worry.',
  credential:
    '6th of October City, Egypt · Business Information Systems, Capital University · Digital Egypt Pioneers Initiative AI & Automation track',
  projects: SITE_CONTENT.en.workPage.projects.slice(0, 4).map(p => ({
    id: p.id,
    title: p.title,
    problem: p.problem,
    built: p.built,
    outcome: p.benefit,
    stack: p.stack,
    ctaLabel: 'Discuss a similar project',
    repoUrl: p.repoUrl,
    image: null,
    status: p.status === 'complete' ? 'complete' : 'coming-soon',
  })),
  info: {
    subtitle: 'AI and Automation Specialist',
    lead: SITE_CONTENT.en.hero.objective,
    paragraphs: SITE_CONTENT.en.about.paragraphs,
    qualifications: [
      { label: 'Education', value: 'Bachelor of Business Information Systems (BIS), Capital University (Expected 2028 · GPA 3.4)' },
      { label: 'Program', value: 'Digital Egypt Pioneers Initiative AI & Automation track' },
      { label: 'Experience', value: 'Software Tester (UTest) · AI Data Annotator (Outlier)' },
      { label: 'Location', value: '6th of October City, Egypt' },
    ],
    skills: SITE_CONTENT.en.services.items.map(s => ({ title: s.title, detail: s.benefit })),
    tools: SITE_CONTENT.en.background.techSkills,
    contactHeading: SITE_CONTENT.en.contact.title,
    contactPitch: SITE_CONTENT.en.contact.lead,
  },
  digitalTwin: {
    title: 'AI Digital Twin',
    subtitle: 'AI Assistant · Live demo coming soon',
    description: SITE_CONTENT.en.featuredTwin.description,
    badge: 'Live demo coming soon',
    ctaLabel: 'Live demo coming soon',
  },
  links: {
    linkedin: CONTACT_INFO.linkedin,
    github: CONTACT_INFO.github,
    email: CONTACT_INFO.email,
  },
};
