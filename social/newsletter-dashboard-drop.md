# Newsletter: Drop #2 -- Claude Code + Supabase = GTM Dashboard

**Subject line options:**
1. Claude Code + Supabase = GTM dashboard (drop #2)
2. i built a dashboard in one session. it's incomplete. that's the point.
3. the growth engineering skill that's going to matter

**Preview text:** drop #2 of the GTM coding agent starter kit. a deployable signals dashboard, shared as it grows.

---

## the email

something shifted.

six months ago I could not have built a 5-page dashboard with signal scoring, campaign tracking, and a Python pipeline in one sitting. the tools existed but the speed didn't. that changed.

this week I sat down with Claude Code and Supabase and built the whole thing. schema, API routes, 5 pages, charts, filters, a scoring engine with exponential decay. 48 files. one session.

that's drop #2 of the GTM coding agent starter kit.

[embed video or link to GitHub README]

### what it is

a deployable Next.js dashboard that sits on top of a Supabase database. 5 pages: campaigns, database intelligence, accounts browser, signals, segments. dark theme. real-time polling. 16 intent signal types with configurable weights.

the signal model is the interesting part. every signal decays exponentially with a 14-day half-life. yesterday's signal is worth more than last month's. diversity bonuses reward breadth across signal types and sources. the weights are configurable. tune them for your market.

the schema enforces a 3-contact-per-company limit. a Postgres trigger blocks a 4th. forces you to rank by quality before you sequence.

### what it's not

I still use HubSpot. I still use Instantly. this is not about replacing tools.

I'm building my database, writing my signal logic, designing my segments. the dashboard is the visual layer on work I'm already doing. it stays in sync because I built both sides.

when I need a new view next week, I add it in 20 minutes. when something looks off, I know which table to check. you can't do that with a vendor's dashboard.

### why it's incomplete

I haven't sent a single email campaign through this yet. the campaign pages show seed data, not real sends.

I'm sharing it now because what you see today will look different next week when I start sending. and the week after when the signal pipeline is running on a cron. the building process is the learning. not the finished product.

### why this skill matters now

the barrier to building production software dropped by an order of magnitude. and it's still dropping. what took me one session today will take 20 minutes in six months.

the people who learn to build now -- even imperfectly, even alongside the SaaS they're already paying for -- are going to have a compounding advantage. this skill gets you hired by companies that need growth engineers who can build. or it lets you build your own thing. either way, you win.

you can still buy every SaaS tool on the market. the point is not to stop paying for them. the point is: experience what it feels like to build your own system. understand how signal scoring works under the hood. see what happens when you can add a dashboard page in 20 minutes instead of waiting for a vendor.

and then see where that takes you.

### fork it

everything is in the repo: [github.com/shawnla90/gtm-coding-agent](https://github.com/shawnla90/gtm-coding-agent)

the dashboard: `starters/signals-dashboard/`
the chapter: `chapters/11-build-your-dashboard.md`
MIT license. star it if you want to follow along.

shawn

---

**Sending notes:**
- Send Tuesday or Wednesday 8-10am EST
- Subject line #1 for the equation hook, #3 for the narrative hook. test both if your platform supports it.
- Include the video thumbnail or a gif as the hero image linking to GitHub
- This newsletter drives to the full blog post at shawnos.ai/blog/claude-code-supabase-gtm-dashboard
- CTA: star the repo, fork it, or read the full blog post
