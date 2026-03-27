# Chapter 02: Context Engineering

**The quality of your AI output is determined by the quality of your context, not the quality of your prompt. Context engineering is how you build workspaces that make agents consistently useful.**

---

## What Is a Context Window?

Before we get into engineering, you need to understand the raw material.

A context window is how much an AI can "see" at once. Think of it as the agent's working memory. Everything the AI considers when generating a response — your instructions, the files it's read, the conversation so far, its own system prompt — all of it has to fit inside this window.

Claude's context window is 200,000 tokens. A token is roughly 4 characters or 3/4 of a word. So 200K tokens is about 150,000 words — roughly two full novels.

That sounds like a lot. It is. But it fills up faster than you think when an agent is reading multiple files, running commands, and tracking a multi-step conversation.

The point: context is a finite resource. What you put in it matters. What you leave out matters just as much.

---

## Structured Context vs Chat History

Most people's experience with AI context looks like this:

```
User: Help me write a cold email
AI: Sure, who's the target?
User: VP of Engineering at mid-market SaaS
AI: What's your product?
User: [3 paragraphs about the product]
AI: Here's a draft...
User: No, that's too formal. I write more casually.
AI: Here's a revised draft...
User: Also I forgot to mention we compete with Outreach
AI: Here's another revision...
```

Six messages in, the AI has the context it needs — scattered across a conversation, mixed with corrections and false starts. This is **unstructured context**. It works, barely, for one-off tasks. It falls apart completely for repeatable workflows.

**Structured context** looks like this:

```
gtm-os/
├── demand/
│   ├── icp.md              # Who you sell to
│   ├── positioning.md      # Why they should care
│   ├── competitors.md      # Who you're up against
│   └── objections.md       # What pushback you'll hear
├── messaging/
│   └── attack-angles.md    # Your best entry points
└── CLAUDE.md               # How to use all of the above
```

When a coding agent opens this workspace, it doesn't need you to explain your product, your buyer, your competitors, or your voice in the chat. It reads the files. Every time. Consistently. Without you repeating yourself.

This is the shift: **instead of writing better prompts, build better workspaces.**

---

## The Layer Order That Matters

Not all context is equal. When you're building structured context for an agent, there's a hierarchy:

### Layer 1: Identity

Who is this agent? What's its role?

```markdown
# Identity
You are a GTM setup assistant inside an open-source starter kit.
Your job is to help the user build a personalized go-to-market workspace.
```

This goes first because it frames everything else. An agent that knows it's a "GTM setup assistant" interprets every subsequent instruction through that lens.

### Layer 2: Rules

Hard constraints. Non-negotiable behaviors.

```markdown
# Rules
- Always ask one question at a time during assessment.
- Be direct. No corporate speak.
- Never fabricate tool capabilities.
- Treat business context as confidential.
```

Rules override everything else. If your domain knowledge says "use exclamation points for enthusiasm" but your rules say "no corporate speak," the rules win.

### Layer 3: Workflow

What does the agent do, step by step?

```markdown
# Workflow
1. Ask 6 assessment questions (one at a time)
2. Recommend a starting tool and mode
3. Build the workspace folder structure
4. Copy relevant templates
5. Assign a learning path
```

Workflows give the agent a playbook. Without them, the agent improvises. Sometimes that's fine. For repeatable GTM processes, you want the playbook.

### Layer 4: Domain Knowledge

The ICP, positioning, competitor intel, voice profile, tool documentation — everything the agent needs to know about your specific business.

This layer is the largest but the least important structurally. A well-identified agent with clear rules and a solid workflow will produce good output even with thin domain knowledge. A poorly identified agent with no rules will produce garbage even if you dump your entire Notion workspace into it.

**The order matters: Identity > Rules > Workflow > Domain Knowledge.**

---

## CLAUDE.md Is Not a Prompt

This is the most common misconception. People hear "put instructions in CLAUDE.md" and think it's like writing a system prompt for ChatGPT. It's not.

A prompt is a one-time input. You write it, the AI reads it, you get a response. Done.

CLAUDE.md is an **operating manual**. It persists across sessions. Every time you open Claude Code (or Cursor) in a project folder, the agent reads CLAUDE.md first. It shapes every interaction, every file read, every command the agent runs.

Here's the difference in practice:

**Prompt approach:**
> "You are a GTM assistant. When I ask you to write emails, use a casual tone, reference my ICP which is VP of Engineering at companies with 50-500 employees, and avoid mentioning competitors by name."

You have to paste this every session. Or save it somewhere and copy it in. And it only covers email writing.

**CLAUDE.md approach:**
```markdown
# Identity
You are a GTM operating assistant for [Company].

# Rules
- Casual, direct tone. No corporate speak.
- Never mention competitors by name in outbound content.
- Reference gtm-os/demand/ files for all buyer context.

# Workflows
## Write Outbound Email
1. Read gtm-os/demand/icp.md for targeting
2. Read gtm-os/demand/positioning.md for value props
3. Read gtm-os/messaging/attack-angles.md for entry points
4. Draft email using voice profile if available
```

This loads automatically. It covers every workflow, not just one. And it points the agent to files instead of trying to cram all the knowledge into a single block of text.

---

## How to Structure a CLAUDE.md

Here's a template you can use for any GTM project:

```markdown
# [Project Name] — Operating Instructions

## Identity
[1-2 sentences: who the agent is and what it does in this project]

## Rules
- [Hard constraint 1]
- [Hard constraint 2]
- [Hard constraint 3]

## Workflows
### [Workflow Name]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### [Another Workflow]
1. [Step 1]
2. [Step 2]

## Reference Paths
- ICP: `path/to/icp.md`
- Positioning: `path/to/positioning.md`
- Voice: `path/to/voice-profile.md`

## Domain Context
[Anything the agent needs to know that doesn't fit above:
product details, pricing, market context, etc.]
```

Keep it under 2,000 words. If your CLAUDE.md is longer than that, you're probably putting domain knowledge inline that should live in separate files the agent can read on demand.

---

## The Common Mistake: One Giant Prompt

The worst thing you can do is dump everything into a single document. Your ICP, your positioning, your competitor analysis, your voice profile, your workflow instructions, your rules — all in one 5,000-word CLAUDE.md.

Why this fails:

1. **It wastes tokens.** The agent reads the whole thing every session, even when it only needs your ICP for the current task.
2. **It's hard to maintain.** When your positioning changes, you're editing a massive document instead of updating one file.
3. **It confuses priority.** The agent can't tell what's a rule vs what's background context when it's all mixed together.

The fix: **CLAUDE.md is the routing layer. Separate files hold the knowledge.**

```markdown
# Good: CLAUDE.md points to files
## Reference Paths
- ICP: `gtm-os/demand/icp.md`
- Positioning: `gtm-os/demand/positioning.md`

# Bad: CLAUDE.md contains everything
## ICP
Our ideal customer is VP of Engineering at mid-market SaaS companies
with 50-500 employees headquartered in the US who are currently using
[8 more paragraphs]...
```

---

## Exercise: Read This Repo's CLAUDE.md

Open the file at the root of this repo:

```
gtm-coding-agent/CLAUDE.md
```

As you read it, identify:

1. **Identity** — Where does it establish who the agent is? (Hint: first two lines)
2. **Rules** — Find the rules section. Count them. Notice they're behavioral constraints, not knowledge.
3. **Workflows** — Find the step-by-step workflows. Notice they have conditional logic ("based on their answers, recommend...").
4. **Reference paths** — Find where it points to other files instead of containing the knowledge inline.

Now ask yourself: if you removed the CLAUDE.md and just typed "help me set up" to a blank Claude Code session, what would happen?

The answer: the agent would ask you what you mean. It has no context. No identity. No workflow. No reference paths. The CLAUDE.md is what turns a general-purpose AI into a GTM setup assistant.

That's context engineering.

---

## The Mindset

Stop thinking about prompt engineering. Start thinking about **workspace engineering**.

The question isn't "how do I write a better prompt?" The question is:

- What files should exist in this project?
- What structure makes them easy for an agent to find and read?
- What instructions does the agent need to use those files effectively?
- What rules prevent the agent from going off the rails?

Build the workspace. The prompts take care of themselves.

---

## Key Takeaways

- A context window is the AI's working memory. Claude's is 200K tokens (~150K words). It's finite.
- Structured context (files + CLAUDE.md) beats unstructured context (chat history) every time.
- Layer order: Identity > Rules > Workflow > Domain Knowledge.
- CLAUDE.md is an operating manual, not a prompt. It persists. It routes. It shapes every interaction.
- Don't dump everything into one document. CLAUDE.md points to files. Files hold the knowledge.

---

**Next:** [Chapter 03 - Token Efficiency](./03-token-efficiency.md) — How to manage your context window without burning money or losing coherence.
