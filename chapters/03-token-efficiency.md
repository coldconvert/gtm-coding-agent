# Chapter 03: Token Efficiency

**You wouldn't send a 10-page email to book a meeting. Don't send 10 pages of context when the agent needs two paragraphs. Token efficiency is about giving the AI exactly what it needs — no more, no less.**

---

## What Are Tokens?

Tokens are how AI models measure text. One token is roughly 4 characters or about 3/4 of a word. The word "positioning" is 3 tokens. The sentence "Our ICP is VP of Engineering at mid-market SaaS companies" is about 14 tokens.

Why should you care? Two reasons:

1. **Context windows have limits.** Claude can hold 200K tokens at once. That's big, but it's not infinite.
2. **API calls cost money per token.** If you're using the API (not the subscription), every token you send and receive has a price. Sloppy context = higher bills.

For subscription users (Claude Pro, Claude Max), tokens don't cost you per-call. But context window limits still apply. Stuffing 180K tokens of irrelevant context leaves only 20K tokens for the agent to think, read new files, and generate output. You're choking it.

---

## Context Window Sizes: A Reality Check

Claude's 200K-token context window can hold roughly:

- 150,000 words (two novels)
- 400 pages of single-spaced text
- An entire mid-sized codebase

That sounds like you'd never run out. Here's how you actually run out:

| What | Approximate Tokens |
|------|-------------------|
| Your CLAUDE.md | 500-2,000 |
| Conversation so far (20 back-and-forth messages) | 5,000-15,000 |
| 3 files the agent reads (ICP, positioning, competitors) | 3,000-6,000 |
| A Python script the agent writes and runs | 1,000-3,000 |
| Script output (API results, CSV data) | 2,000-50,000+ |
| Agent's reasoning and planning | 5,000-20,000 |

A single enrichment workflow that pulls 200 company records can eat 50K tokens just in API response data. Add your conversation history, CLAUDE.md, and the files it read to plan the work — you're at 80K tokens before the agent starts its second task.

The lesson: **bigger isn't always better.** A 200K window doesn't mean you should use 200K tokens. It means you have headroom for complex tasks — if you're disciplined about what goes in.

---

## The Shoemaker's Children Problem

GTM people are professional communicators. You craft emails that get responses in 50 words. You write subject lines that get opened in 5 words. You build decks that tell a story in 10 slides.

Then you open an AI tool and dump in:

- An entire blog post when you need the key thesis
- A full CRM export when you need 10 accounts
- Three pages of instructions when a three-line CLAUDE.md section would do
- Your entire competitive landscape when the agent only needs one competitor

This is the shoemaker's children problem. The cobbler's kids have no shoes. The GTM operator who crafts tight messages for prospects sends unstructured walls of text to their AI tools.

Apply the same discipline to your AI context that you apply to your outbound. Be concise. Be structured. Lead with what matters.

---

## Token Budgets: A Practical Framework

Think of your context window as a budget. Here's how to allocate it:

```
Total budget: 200,000 tokens

Reserved for agent thinking:     40,000  (20%)
Reserved for output generation:  30,000  (15%)
CLAUDE.md + system context:       2,000  (1%)
Conversation history:            15,000  (7.5%)
Available for task context:     113,000  (56.5%)
```

That "available for task context" is what you actually control. It's the files the agent reads, the data it processes, and the results it works with.

For most GTM tasks, you need way less than 113K tokens of context. Here's what typical tasks actually require:

| GTM Task | Context Needed |
|----------|---------------|
| Write a cold email sequence | ~3K tokens (ICP + positioning + voice profile) |
| Analyze a competitor | ~5K tokens (their website content + your positioning) |
| Build an account list | ~2K tokens (ICP) + API response data |
| Create a content piece | ~6K tokens (voice DNA + topic research + examples) |
| Qualify a lead | ~4K tokens (ICP + signals + the lead's data) |

**The 80/20 rule: most GTM tasks need fewer than 10K tokens of well-structured context.** The rest of your budget is for the agent to think, execute, and handle unexpected complexity.

---

## Subagents: Divide and Conquer

Here's a scenario: you want to research 5 competitors, then write positioning that differentiates you from all of them.

If you do this in one session:
1. Agent reads competitor 1's website (8K tokens)
2. Agent reads competitor 2's website (10K tokens)
3. Agent reads competitor 3's website (7K tokens)
4. Agent reads competitor 4's website (9K tokens)
5. Agent reads competitor 5's website (11K tokens)
6. Now the agent writes positioning with 45K tokens of competitor data in context

That works, but 45K tokens of raw website content is noisy. The agent is wading through navigation menus, footer links, and pricing tables to find the relevant positioning claims.

The subagent approach:

```
Main agent task: "Write positioning that differentiates us"
  └── Subagent 1: "Research competitor 1. Return: positioning claim,
                   target buyer, key differentiators. Max 200 words."
  └── Subagent 2: "Research competitor 2. Same format."
  └── Subagent 3: "Research competitor 3. Same format."
  └── Subagent 4: "Research competitor 4. Same format."
  └── Subagent 5: "Research competitor 5. Same format."
Main agent receives: 5 structured summaries (~1K tokens total)
Main agent writes positioning with clean, distilled context
```

In Claude Code, you can do this by telling the agent to spawn subagents for research tasks:

```
> Research these 5 competitors and save a summary of each one's
> positioning to gtm-os/demand/competitors.md. Then use those
> summaries to draft our positioning in gtm-os/demand/positioning.md.
```

The agent handles the research in contained steps, saves distilled results to files, then reads those files for the final task. The raw website content never pollutes the main context.

This is the same principle behind why your GTM-OS has separate files for ICP, positioning, and competitors instead of one giant document. Each file is a clean, bounded piece of context the agent can load when needed.

---

## Cost Implications

If you're on a Claude subscription (Pro or Max), tokens don't have a per-call cost. But if you're building automation with the API — cron jobs, enrichment scripts, multi-step workflows — every token has a price.

Rough API pricing math (this changes, but the principle holds):

- Input tokens (what you send): ~$3-15 per million tokens depending on model
- Output tokens (what the AI generates): ~$15-75 per million tokens

A single API call with 50K input tokens and 2K output tokens might cost $0.15-0.90. Run that 100 times a day for an enrichment workflow, and you're at $15-90/day.

The same workflow with 5K input tokens (because you structured your context well) costs $0.015-0.09 per call. At 100 calls/day: $1.50-9/day.

**10x less context = 10x lower cost.** Same output quality if the context is well-structured.

---

## Practical Tips for Token Efficiency

### 1. Use structured markdown

AI models parse markdown faster and more accurately than plain text. Headers, bullet points, and tables give the model clear structure to navigate.

```markdown
# Bad: wall of text
Our ideal customer is a VP of Engineering at a mid-market SaaS company
with 50 to 500 employees who is currently evaluating developer tools
and has budget authority and is based in the United States or Canada
and has been in role for at least 6 months...

# Good: structured markdown
## ICP
- **Title:** VP of Engineering
- **Company size:** 50-500 employees
- **Industry:** SaaS
- **Geo:** US, Canada
- **Trigger:** Evaluating developer tools
- **Qualifier:** Budget authority, 6+ months in role
```

Same information. The structured version is easier for the AI to parse, reference, and apply correctly.

### 2. Reference files instead of pasting content

```markdown
# Bad: pasting in your CLAUDE.md
"Here's my ICP: [500 words of ICP pasted into chat]"

# Good: letting the agent read the file
"Read gtm-os/demand/icp.md and use it to write outbound emails"
```

When you paste content into chat, it stays in the conversation history forever, eating tokens on every subsequent message. When the agent reads a file, it reads it once and uses it.

### 3. Use .claude/ skills for repeatable tasks

If you have a task you run repeatedly (like "write a cold email sequence"), create a skill file in `.claude/` that contains the instructions. The agent loads it on demand instead of you explaining the task every time.

```
.claude/
└── commands/
    └── write-sequence.md    # Instructions for writing email sequences
```

Then you just invoke the skill instead of re-explaining the workflow.

### 4. Trim your conversation history

Long conversations accumulate context. If you're 30 messages deep and the agent is getting slow or confused, start a new session. Your CLAUDE.md and files persist. The conversation history doesn't need to.

### 5. Be specific about what you need

```
# Bad: vague request (agent reads everything trying to figure out what you want)
"Help me with outbound"

# Good: specific request (agent reads only what it needs)
"Read gtm-os/demand/icp.md and write 3 cold email variants
targeting the VP of Engineering persona. Use the pain points
from gtm-os/demand/objections.md for the hooks."
```

Specific requests let the agent load targeted context. Vague requests force it to read broadly, burning tokens on files that may not be relevant.

---

## Exercise: Audit Your Context Usage

Next time you're working with a coding agent, pay attention to what's in the context:

1. **How many files has the agent read?** Do they all relate to the current task?
2. **How long is your conversation?** Could you start fresh and get the same result in 3 messages?
3. **Are you pasting content into chat?** Could the agent just read the file directly?
4. **Are you re-explaining things the CLAUDE.md should handle?** If so, update the CLAUDE.md.

Try this: take your most common GTM task and see how few tokens of context you can provide while still getting good output. You'll probably find that 80% of what you've been including is noise.

---

## Key Takeaways

- Tokens are the currency of AI context. ~4 characters = 1 token. Context windows are finite.
- Most GTM tasks need fewer than 10K tokens of context if it's well-structured. Don't fill a 200K window by default.
- Apply the same message discipline to AI that you apply to prospects. Concise. Structured. Lead with what matters.
- Subagents keep research separate from execution so raw data doesn't pollute your main context.
- On the API, efficient context is directly proportional to lower costs. 10x less context = 10x cheaper.
- Structured markdown, file references, skills, and specific requests are your main tools for staying efficient.

---

**Next:** [Chapter 04 - OAuth, CLI, and APIs](./04-oauth-cli-apis.md) — Three ways to connect GTM tools to your coding agent, and when to use each.
