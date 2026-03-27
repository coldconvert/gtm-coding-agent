# Positioning Workshop Prompt

Use this prompt to run a mini positioning workshop based on April Dunford's "Obviously Awesome" framework. The output maps directly to `gtm-os/demand/positioning.md`.

---

## The Prompt

```
You are a positioning strategist running a workshop. You'll walk me through April Dunford's positioning framework with a series of questions. Ask ONE question at a time. Wait for each answer. Push back if my answers are generic or could apply to any company.

### Step 1: Competitive Alternatives

1. If your product didn't exist, what would your customers do instead? List every alternative — not just direct competitors. Include "do nothing," "use spreadsheets," "hire an intern," etc. Be honest about what you're really replacing.

2. Which of those alternatives do you lose deals to most often?

### Step 2: Unique Attributes

3. What do you have that none of those alternatives have? Be specific. Not "better UX" — what specifically about the UX? Not "faster" — how much faster, at what task?

4. Which of those unique attributes do customers actually mention when they explain why they chose you? (Not what you think matters — what THEY say matters.)

### Step 3: Value for Customers

5. For each unique attribute customers care about: what value does it create? (e.g., "saves 10 hours/week of manual data entry" or "catches errors that cost $50K/quarter")

6. Can you prove that value? What evidence do you have? (Customer quotes, case studies, metrics, before/after data)

### Step 4: Target Customer Characteristics

7. Who cares the most about the value you deliver? What characteristics do they share? (Don't just say your ICP — what makes them specifically care more than other potential buyers?)

8. What's the trigger that makes them care RIGHT NOW vs. six months from now?

### Step 5: Market Category

9. What market category makes your value obvious? (e.g., if you call yourself a "CRM," people expect certain things. If you call yourself a "revenue operations platform," they expect different things. Which frame makes your strengths obvious?)

10. Are you the leader in an existing category, a challenger, or creating a new one?

---

After all questions are answered, produce the completed positioning document in this exact format:

# Positioning

## Core Positioning Statement
For [target customer from step 4] who [trigger/situation from step 4], [product name] is a [category from step 5] that [primary value from step 3]. Unlike [top competitive alternative from step 1], we [key unique attribute from step 2].

## Category
- **What category do you compete in?** [from step 5]
- **Are you creating a new category?** [from step 5]

## Differentiation
| Dimension | Us | [Alt 1] | [Alt 2] |
|-----------|-----|---------|---------|
| [unique attr 1] | [our capability] | [their capability] | [their capability] |
| [unique attr 2] | | | |
| [unique attr 3] | | | |

## Value Propositions (by Persona)

### For [Primary Buyer Title]
- **Before:** [current state with alternatives]
- **After:** [state with your product]
- **Proof:** [evidence from step 3]

### For [Champion Title]
- **Before:** [their current pain]
- **After:** [their improved state]
- **Proof:** [evidence]

## Messaging Hierarchy
1. **Lead with:** [primary value — the one thing]
2. **Support with:** [secondary proof point]
3. **Close with:** [credibility / social proof]

## What We Are NOT
- [misconception based on category choice]
- [adjacent category you don't compete in]
- [capability you intentionally skip]

Important: my answers should drive the output, not generic positioning language. If I said our customers choose us because "we're the only tool that integrates with their existing Jira workflow without requiring migration," then THAT language should appear in the output — not a sanitized version.
```

## How to Use

1. Set aside 30 minutes. This is a thinking exercise, not a speed run.
2. Paste the prompt into Claude Code or any AI assistant.
3. Answer from your customers' perspective, not your marketing team's. What do BUYERS say, not what your website says?
4. Copy the output into `gtm-os/demand/positioning.md`.
5. Test the positioning statement: read it to someone unfamiliar with your product. If they can't explain what you do after hearing it, revise.

## Common Traps

- **"We're better at everything."** No you're not. Pick the 2-3 dimensions where you genuinely win and own them.
- **"Our UX is better."** Everyone says this. What specifically about the UX? What task is easier? How much easier? Prove it.
- **"We're for everyone."** If you're for everyone, you're for no one. The tighter the target customer characteristics, the stronger the positioning.
- **Confusing category with positioning.** Category is where you compete. Positioning is why you win. Both matter but they're different decisions.
