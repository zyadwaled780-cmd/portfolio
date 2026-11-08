# Portfolio Brief

## ROLE
Senior creative front-end developer. Building a personal portfolio website step by step. Follow the phases below and STOP after each phase, waiting for "next".

## FIRST ACTION
Save this entire brief into a file called BRIEF.md in the project root. At the start of every future phase, re-read BRIEF.md before writing code.

## AUDIENCE
The main visitor is a NON-TECHNICAL potential client (a business owner). Everything must be understandable without technical knowledge. Use plain business language. Keep the n8n-style look, but node titles and copy must be human, not jargon. No JSON views. No jargon in headlines.

## CONCEPT
The portfolio IS an automation workflow, styled like the n8n editor canvas (I work in AI and automation, so the site itself is the proof).
Visitor flow:
1. A "Manual Trigger" node sits alone on the canvas. The visitor clicks "Execute workflow".
2. The node runs (short execution animation), then a connection line draws out and the camera glides along the workflow.
3. The workflow reaches a "Who I Am" intro node, then continues to a "My Work" hub node, which branches with several arrows to project nodes. The visitor can travel from project to project along the arrows, or pick one project directly.
4. Picking a project opens a project view that fills most of the screen (Problem, What I built, Outcome, de-emphasized tech chips, and a call-to-action button). Closing it returns to the workflow at that node, ready to move to the next project.
5. After the last project, a "Let's Talk" node leads to the Info > Contact section.
Motion should be rich, smooth and light. Everything must feel effortless.

## VISUAL DIRECTION
- Dark mode only for now. Colors close to the n8n dark editor: near-black canvas with a subtle dot grid, dark gray node cards, thin borders, coral/orange primary, pink accent, green for success. Use these as design tokens (CSS variables) and tune by eye:
  `--bg:#16161a; --grid-dot:#2a2b33; --panel:#1e1f25; --panel-2:#26272e; --border:#34353e; --text:#eceef3; --text-muted:#8d909c; --primary:#ff6d5a; --primary-hover:#ff8a7a; --accent:#ea4b71; --success:#2fbf71`
- Mood reference: goodgrowth.com. Take ONLY the mood: retro console/boot feeling, dithered/halftone texture, bracket-style controls like "[ ● ]", small uppercase mono labels, cream pill buttons for the top navigation. Do NOT use 3D, globes, discs, or copy any asset, logo, text, code or layout from that site. Do not recreate the circle.
- Typography: Unbounded for big display text, Space Grotesk for UI, JetBrains Mono for labels and counters (Google Fonts).
- Background: CSS dot grid plus a very subtle dither/halftone noise overlay (Bayer pattern) rendered ONCE (static canvas or CSS), never redrawn per frame.

## TECH CONSTRAINTS
- Vanilla HTML, CSS and JavaScript (ES modules). No framework, no 3D library.
- GSAP (3.12.x from cdnjs) for animation. SVG for connection lines. DOM elements for nodes. The canvas is a "world" container moved with transforms by a small camera helper.
- Animate only transform and opacity wherever possible. Target a steady 60fps on a normal laptop. No per-frame heavy work.
- Respect prefers-reduced-motion. Keyboard accessible (Enter and Space on buttons, visible focus states, Esc to go back).
- Language: English only for now.
- English UI text, short and professional.
- Use clamp() and relative units so mobile can be added later, but do NOT build the mobile layout yet. Desktop first.
- No deployment setup for now.
- MODELS NOTE: keep code simple and well commented so it can be continued by a different model.

## SOUND
- Web Audio API only, sounds generated in code (no audio files). Calm, quiet and minimal: a soft click, a gentle tick when moving between nodes, a soft chime on success. Master volume low (about 0.15).
- Nothing plays on page load. The AudioContext starts on the first user click. A bracket-style sound toggle "[ ♪ ]" in the top bar (small animated bars when ON), sound ON by default after the first click.

## CONTENT (keep in js/content.js, easy to edit)
- Name: Zyad Waled.
- Wordmark: "ZYAD WALED".
- Intro title: "AI Automation for Businesses".
- Intro pitch (exact):
  "I help small businesses stop losing hours to repetitive work. I design AI-powered automations that connect the tools you already use, like email, messages, spreadsheets and customer support, so routine tasks run on their own.
  Before automation, I tested real software for global testing platforms, which taught me to spot what breaks before it reaches your customers. I always start by understanding your problem, then build a solution that is reliable and simple to use."
- Small line: "Based in Egypt · Business Information Systems, Capital University · DEPI AI Automation Program".
- Projects (draft copy, easy to edit), each with: id, title, problem, built, outcome (placeholder), stack[], ctaLabel, ctaUrl, image (null = show an empty image placeholder block with a dithered pattern and the label "Image coming soon"), status.
  1. "Inbox Summarizer". Problem: "A crowded inbox hides what matters." Built: "An assistant that reads incoming emails and turns each one into a short, clear summary, using an AI model that runs on your own computer." Stack: Python, Gmail API, Ollama, n8n. Repo: https://github.com/zyadwaled780-cmd/gmail-ollama-summarizer
  2. "Customer Support Assistant". Problem: "Customers wait for answers to questions that are already in your documents." Built: "An AI chat assistant that answers customer questions from a company's own documents, available any time. Team project." Stack: Python, Ollama, Gradio, RAG. Repo: https://github.com/samirhanna11/ai-customer-support-agent
  3 and 4. "Coming soon" placeholder projects, so I can test branching with several arrows.
- Links: LinkedIn linkedin.com/in/zyad-waled-4048a33a0, GitHub github.com/zyadwaled780-cmd. Email: placeholder.

## PROJECT COPY STRUCTURE (Phase 3)
- Problem, What I built, Outcome (placeholder for now), and a small row of tech chips (de-emphasized, small, muted).

## PROJECT CTA
- Main button: "Discuss a similar project" → opens Info view scrolled to Contact section.
- Small secondary text link: "View code" → GitHub repo.

## INFO VIEW (Phase 4)
- Holds the full About, qualification, skills and contact.
- Layout reference: goodgrowth.com Info page (big name, subtitle, short paragraphs, then Contact / Elsewhere columns). Mood only, do not copy.

## PHASES
1. Foundation + Manual Trigger. ✅ DONE
2. Full workflow canvas: nodes, connections, camera, branching, navigation between projects (wheel, drag, arrow keys, next/prev buttons). ✅ DONE
3. Project detail view that fills most of the screen, the CTA, and the return to the workflow. ✅ DONE
4. Info and Contact views, plus an empty placeholder node/button reserved for a future AI chatbot ("Digital Twin"). ✅ DONE
5. Polish: motion, sound, performance, accessibility. ✅ DONE
6. Mobile version (only after I approve the desktop version). ✅ DONE

## RULES
- No console errors or warnings.
- If something is ambiguous, choose the simplest reasonable option and tell me. Do not ask many questions.
- Keep code small, commented and modular. Do not build anything from later phases.
- When finished: run a local static server (for example python -m http.server), open the page in your browser, take screenshots at 1920x1080 and 1366x768, check the console, then give me a short summary, how to run it, and a test checklist. Then STOP and wait for "next".
