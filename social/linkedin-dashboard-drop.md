# LinkedIn Post — Dashboard Drop

---

built my own GTM dashboard instead of paying for one.

open-sourcing the whole thing today.

the setup: Next.js + Supabase + a signal scoring engine I wrote in Python. 5 pages. dark theme. real-time polling. deployed to Vercel for free.

what it tracks:
- company database with ICP scoring (0-100)
- intent signals from LinkedIn, Reddit, and engagement data
- contact ranking (top 3 per company, enforced at the database level)
- campaign segments computed live from your data
- domain health, send volume, bounce rates

the signal model is the interesting part. 16 intent signal types, each weighted differently. a tool evaluation signal (someone comparing vendors) scores 10. a content engagement signal scores 3. all signals decay exponentially with a 14-day half-life. yesterday's signal is worth more than last month's.

this is drop #2 of the GTM coding agent starter kit.

drop #1 was 10 chapters on building GTM with coding agents. context engineering, Python for GTM, voice DNA, automation.

drop #2 adds the dashboard starter + a new chapter on building it. fork the repo, set up Supabase, run 3 SQL files, and you have a working dashboard in 10 minutes.

the thesis: we are entering a micro SaaS era where every go-to-market engineer will be able to build production tools on the spot. the AI is getting better at building real things, not just prototypes. if you can describe what you need, you can ship it.

this is not saying SaaS tools are going away. it is saying the skill of being able to build your own tools will carry you. even if you use the SaaS, understanding what is happening underneath makes you better at the job.

who this is for:
- GTM engineers who want to build, not just buy
- founders doing their own outbound
- SDRs who want to understand the data behind their sequences
- anyone curious about what a production dashboard actually looks like under the hood

the full stack: Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui, Recharts, Supabase Postgres. ~40 files. MIT license.

fork it. make it better. open a PR if you build something cool.

link in comments.

shawn, the gtme alchemist

---

**First comment:**

GitHub link: https://github.com/shawnla90/gtm-coding-agent

chapter 11 + the full dashboard starter are in `starters/signals-dashboard/`. fork it and `npm run dev`.

---

**Posting notes:**
- No links in post body (kills reach)
- Reply to every comment in the first 2 hours
- If people ask about the signal model, explain the decay formula
- If people ask about alternatives to Exa, point to Apollo/Clay/manual CSV
- Pin the link comment
- Post between 8-10am EST Tuesday or Wednesday
- Consider adding a screenshot or short video clip of the dashboard

