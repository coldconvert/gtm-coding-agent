# Chapter 01: Coding Agents vs Code Editors

**A coding agent reads your files, runs commands, and builds things. A code editor with AI features autocompletes your lines. Know the difference before you pick your tools.**

---

## The Three Categories

Every AI tool GTM operators encounter falls into one of three buckets. Understanding which bucket you're reaching into determines whether you get results or waste an afternoon.

### 1. Chat interfaces (ChatGPT, Claude.ai, Gemini)

These are conversation tools. You type a question, you get an answer. They're good at:

- Answering quick GTM questions ("What's a typical email open rate for cold outbound to VPs of Engineering?")
- Brainstorming subject lines, ad copy, or positioning angles
- Explaining concepts you don't understand yet
- Summarizing long documents you paste in

What they can't do: read your files, run scripts, modify your codebase, call APIs, or remember what you told them last Tuesday. Every conversation starts from zero unless you manually paste context back in.

**Use chat interfaces for:** Quick questions, brainstorming, one-off copy tasks. Code comfort level doesn't matter.

### 2. AI code editors (Cursor, Windsurf, GitHub Copilot)

These are code editors with AI bolted in. You open a project folder, the AI can see your files, and it helps you write and edit code through a visual interface. They're good at:

- Editing files you can see in the sidebar
- Autocompleting code as you type
- Explaining code when you highlight it
- Making changes across a few files when you point them in the right direction

The key advantage: a GUI. You see your file tree, your open tabs, your terminal output. If you're at code comfort level 1-2, this visual scaffolding matters. You can watch the AI make changes and approve them before they land.

**Use AI code editors for:** Learning your way around a codebase, making targeted edits, anything where you want to see the changes before they happen. Best for code comfort levels 1-2.

### 3. Coding agents (Claude Code, Codex CLI, Aider)

These are autonomous agents that operate in your terminal. You give them a task. They read whatever files they need, run whatever commands are required, create or modify files, and execute multi-step plans — all without you pointing at each file individually.

Here's what that looks like in practice:

```bash
# You open Claude Code in your project folder
claude

# You type a task
> Read my ICP file, pull the top 50 companies from Apollo that match,
> enrich them with Exa for recent news, and save the results as a CSV.
```

The agent then:
1. Reads `gtm-os/demand/icp.md` to understand your target buyer
2. Writes a Python script that calls the Apollo API
3. Runs the script and gets the results
4. Writes another script to enrich those results with Exa
5. Saves the final output as a CSV

You didn't open a single file manually. You didn't write a line of code. You described the outcome, and the agent figured out the steps.

**Use coding agents for:** Multi-step GTM workflows, building automation, anything where the task requires reading context, making decisions, and executing. Best for code comfort levels 3-4 (though 2s can learn fast with structured context).

---

## Terminal vs GUI: The Real Tradeoff

The tradeoff between coding agents and AI code editors isn't "better vs worse." It's **power vs accessibility**.

| | AI Code Editor (Cursor) | Coding Agent (Claude Code) |
|---|---|---|
| Interface | Visual GUI with file tree, tabs | Terminal — text in, text out |
| Autonomy | Suggests edits, you approve each one | Executes multi-step plans |
| Context | Sees open files, sometimes the whole project | Reads any file it needs, when it needs it |
| Learning curve | Low — feels like VS Code | Medium — requires terminal comfort |
| Best for | Editing existing files, learning | Building new things, automation |

If you've never used a terminal, start with Cursor. Read these chapters. Practice the exercises. When you find yourself thinking "I wish I could just tell it to do the whole thing" — that's when you're ready for Claude Code.

If you're already comfortable in a terminal, skip straight to Claude Code. You'll move faster.

---

## CLAUDE.md: The Universal Entry Point

Here's the thing that changes everything: **CLAUDE.md**.

When you open Claude Code (or Cursor, or any agent that supports it) inside a project folder, the first thing it does is read a file called `CLAUDE.md` in the root directory. This file tells the agent:

- Who it is and what it should do
- What the project structure looks like
- Rules it must follow
- Domain knowledge it needs

This repo has one. Go look at it:

```
gtm-coding-agent/CLAUDE.md
```

That file is why, when you type `help me set up` in Claude Code, the agent knows to ask you six specific questions, recommend a mode, and build your workspace. It's not magic. It's structured context.

CLAUDE.md works the same way whether you're in Cursor or Claude Code. It's the universal entry point for making any coding agent useful in your project.

---

## The Mental Model Shift

Here's the most important thing in this chapter:

**You're not "prompting." You're giving an agent a workspace and instructions.**

When you use ChatGPT, you're prompting. You craft a message, you get a response, you craft another message. It's a conversation.

When you use a coding agent, you're operating. You build a workspace (files, folders, CLAUDE.md, scripts), and the agent operates inside it. The quality of the workspace determines the quality of the output — not the cleverness of your prompt.

This is why GTM operators who dump everything into a single chat message get mediocre results. They're treating an agent like a chatbot. The agent doesn't need a better prompt. It needs a better workspace.

```
Bad:  "Write me a cold email for VP of Engineering at mid-market SaaS companies"

Good: A workspace with an ICP file, positioning doc, competitor analysis,
      voice DNA profile, and a CLAUDE.md that says "when asked to write
      outbound emails, reference all demand/ files and use voice/profile.md"
```

The first approach gives you generic output. The second gives you output that sounds like you, targets the right buyer, addresses the right pain points, and avoids your competitors' talking points. Same AI. Different workspace.

---

## Exercise: Know Your Starting Point

Answer these honestly:

1. Have you used a terminal before? (If no, your starting tool is Cursor.)
2. Can you run a Python script if someone gives you the command? (If yes, you can handle Claude Code with guidance.)
3. Do you have a CLAUDE.md in any of your projects? (If no, Chapter 02 will fix that.)

Based on your answers:
- **Terminal = no:** Start with Cursor. Read all 10 chapters. Graduate to Claude Code when you're ready.
- **Terminal = yes, CLAUDE.md = no:** Install Claude Code. Read Chapter 02 next — it's the highest-leverage thing you can learn.
- **Terminal = yes, CLAUDE.md = yes:** You're ahead of most. Read Chapter 03 to optimize your token usage, then jump to whatever GTM workflow you need (Chapters 04-10).

---

## Key Takeaways

- A chatbot answers questions. A coding agent reads your files, runs commands, and builds things. Don't confuse them.
- Cursor (GUI) is for code comfort levels 1-2. Claude Code (terminal) is for 3-4. ChatGPT is for quick questions at any level.
- CLAUDE.md is the universal entry point that makes any agent useful in your project.
- Stop thinking about better prompts. Start thinking about better workspaces.

---

**Next:** [Chapter 02 - Context Engineering](./02-context-engineering.md) — How to structure the context that makes your agent actually useful.
