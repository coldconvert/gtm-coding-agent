# Chapter 10: Terminal Mastery

**Claude Code runs in a terminal. The more comfortable you are in that environment, the more you can get out of coding agents. This chapter covers tmux, SSH, multiplexing, and the terminal commands that make GTM work faster.**

---

## Why Terminal Skills Matter

Every previous chapter has been about what you can build with coding agents. This chapter is about where you build it.

Claude Code is a terminal application. It reads files, runs commands, writes code — all through text. If you're comfortable in that environment, you can run multiple agents in parallel, monitor long-running tasks, work on remote machines, and build workflows that would be impossible in a GUI.

If you're not comfortable, every chapter you've read so far is harder than it needs to be.

The good news: you don't need to become a systems administrator. You need about 20 commands, one tool (tmux), and a mental model for how terminal sessions work. That's what this chapter gives you.

---

## tmux: The Terminal Multiplexer

tmux is the single most useful terminal tool for anyone running coding agents. Here's what it does in plain terms: it lets you run multiple terminal sessions inside one window, and those sessions survive even if you close your terminal.

Why that matters:

- Claude Code sometimes runs for minutes while it works through a complex task. You need to do other things while it runs.
- You often want to watch a log file while an agent works.
- You want to start a session at work, close your laptop, open it at home, and pick up exactly where you left off.

### Installing tmux

```bash
# Mac (with Homebrew)
brew install tmux

# Ubuntu/Debian
sudo apt install tmux
```

### The basics

```bash
# Create a new named session
tmux new -s gtm

# You're now inside tmux. Everything looks the same, but you're in a session.

# Split the window vertically (side by side panes)
# Press: Ctrl-b then %

# Split the window horizontally (top and bottom panes)
# Press: Ctrl-b then "

# Move between panes
# Press: Ctrl-b then arrow key (left/right/up/down)

# Detach from the session (it keeps running)
# Press: Ctrl-b then d

# List running sessions
tmux ls

# Reattach to your session
tmux attach -t gtm

# Kill a session when you're done
tmux kill-session -t gtm
```

That's it. Those 7 operations cover 90% of what you'll do with tmux.

### The GTM multiplexing pattern

Here's the layout that works for running coding agents:

```
┌─────────────────────────────┬──────────────────────┐
│                             │                      │
│   Pane 1: Claude Code       │  Pane 2: Logs        │
│                             │                      │
│   (your agent session)      │  tail -f output.log  │
│                             │                      │
│                             │                      │
├─────────────────────────────┴──────────────────────┤
│                                                     │
│   Pane 3: Shell / Script runner                     │
│                                                     │
│   python3 enrich.py | sqlite3 gtm.db               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

To build this layout:

```bash
# Start a new session
tmux new -s gtm

# Split right (for logs)
# Ctrl-b %

# Move to the left pane
# Ctrl-b left-arrow

# Split bottom (for shell)
# Ctrl-b "

# Now you have three panes. Move between them with Ctrl-b + arrow keys.
```

Pane 1: Run `claude` — this is your coding agent session. Give it tasks, watch it work.

Pane 2: Run `tail -f` on whatever log or output file the agent is writing to. You see results in real time without interrupting the agent.

Pane 3: Your scratch pad. Run quick commands, test scripts, query your database, check API responses. Whatever you need while the agent works.

---

## SSH: Remote Machines

SSH lets you run terminal sessions on machines that aren't in front of you. This matters when you want to:

- Run agents on a more powerful machine (a Mac Mini in a closet, a VPS in the cloud)
- Keep long-running GTM scripts going 24/7 without leaving your laptop open
- Access your GTM workspace from any computer

### Basics

```bash
# Connect to a remote machine
ssh user@your-server.com

# Connect with a specific key
ssh -i ~/.ssh/mykey user@your-server.com

# Copy a file to the remote machine
scp local-file.csv user@your-server.com:~/data/

# Copy a file from the remote machine
scp user@your-server.com:~/output.csv ./
```

### The pattern: SSH + tmux

This is where it gets powerful. SSH into a remote machine, start a tmux session, run your agent, detach, close your laptop. The agent keeps running.

```bash
# From your laptop
ssh user@your-server.com

# On the remote machine
tmux new -s gtm-enrichment

# Start your enrichment script or agent session
claude
> Read the ICP and enrich the top 500 accounts using Apollo

# Detach: Ctrl-b d
# Disconnect: exit (or just close the terminal)

# Later, from your phone, another laptop, wherever:
ssh user@your-server.com
tmux attach -t gtm-enrichment
# You're right back where you left off
```

This is how GTM operators run overnight enrichment jobs, content generation pipelines, and recurring scripts without needing a SaaS tool to host them.

---

## Terminal Commands for GTM

You don't need to memorize 200 commands. Here are the ones that come up constantly in GTM work.

### Counting and inspecting data

```bash
# Count lines in a CSV (subtract 1 for the header)
wc -l prospects.csv

# See the first 5 lines of a file (check column headers)
head -5 prospects.csv

# See the last 5 lines (check if your script finished)
tail -5 output.csv

# Count unique values in column 3 of a CSV
cut -d',' -f3 prospects.csv | sort | uniq -c | sort -rn
```

### Working with JSON

```bash
# Pretty-print a JSON file
cat response.json | python3 -m json.tool

# Extract a specific field with jq
cat response.json | jq '.results[].company_name'

# Count results in a JSON array
cat response.json | jq '.results | length'

# If you don't have jq installed:
brew install jq
```

### Querying local databases

```bash
# Open a SQLite database
sqlite3 gtm.db

# Run a query directly from the command line
sqlite3 gtm.db "SELECT COUNT(*) FROM prospects WHERE status = 'enriched';"

# Export query results as CSV
sqlite3 -header -csv gtm.db "SELECT * FROM prospects;" > export.csv
```

### Quick Python one-liners

```bash
# Parse a date
python3 -c "from datetime import datetime; print(datetime.now().strftime('%Y-%m-%d'))"

# URL-encode a string
python3 -c "import urllib.parse; print(urllib.parse.quote('VP of Engineering'))"

# Quick math
python3 -c "print(f'{3247/89:.1f} emails per day')"
```

### Monitoring

```bash
# Watch a file for changes (updates every 2 seconds)
watch -n 2 wc -l output.csv

# Follow a log file in real time
tail -f enrichment.log

# Check if a process is still running
ps aux | grep python
```

---

## Aliases: Speed Up Your Workflow

If you run the same commands repeatedly, create aliases. Add these to your `~/.zshrc` (Mac) or `~/.bashrc` (Linux):

```bash
# Open Claude Code in your GTM workspace
alias gtm="cd ~/gtm-workspace && claude"

# Quick CSV line count
alias csvcount="wc -l"

# Query your GTM database
alias gtmdb="sqlite3 ~/gtm-workspace/data/gtm.db"

# Start your standard tmux layout
alias gtmux="tmux new-session -s gtm -d && tmux split-window -h -t gtm && tmux split-window -v -t gtm:0.0 && tmux attach -t gtm"
```

After adding aliases, reload your shell:

```bash
source ~/.zshrc
```

Now `gtm` opens Claude Code in your workspace. `gtmux` builds your three-pane layout in one command. Small things that save minutes every day.

---

## For Beginners: Start Here

If tmux feels like too much right now, start simpler.

**Mac:** Install [iTerm2](https://iterm2.com). It has built-in split panes (Cmd-D for vertical, Cmd-Shift-D for horizontal) and tabs. No tmux required. You get 80% of the benefit with zero setup.

**Windows:** Use [Windows Terminal](https://aka.ms/terminal). It supports tabs and split panes natively.

**The progression:**
1. Start with iTerm2 or Windows Terminal split panes
2. Get comfortable running Claude Code in one pane and watching output in another
3. When you find yourself wanting sessions that survive closing your terminal, learn tmux
4. When you find yourself wanting to run agents on remote machines, learn SSH

There's no rush. Each step unlocks more capability, but even step 1 makes you significantly more productive with coding agents.

---

## The Terminal Workflow

Here's the complete workflow, putting it all together:

```
1. Open terminal
2. Start tmux session:          tmux new -s gtm
3. Set up panes:                Ctrl-b % (split), Ctrl-b " (split again)
4. Pane 1 — start Claude Code:  claude
5. Pane 2 — watch output:       tail -f output.log
6. Pane 3 — keep a shell ready: for quick commands, queries, testing
7. Give the agent a task
8. Watch it work across panes
9. Review output
10. Iterate or move to the next task
```

When you're done for the day, Ctrl-b d to detach. Everything keeps running. Tomorrow, `tmux attach -t gtm` and you're right back.

---

## Exercise: Build Your GTM Terminal

Do this now. It takes 5 minutes.

1. Install tmux: `brew install tmux` (Mac) or `sudo apt install tmux` (Linux)
2. Create a session: `tmux new -s gtm`
3. Split the window: Ctrl-b % (vertical split)
4. In the left pane, run: `claude` (or just open a shell if you're practicing)
5. In the right pane, run: `ls -la` (just to prove you're in a separate pane)
6. Move between panes: Ctrl-b left-arrow, Ctrl-b right-arrow
7. Detach: Ctrl-b d
8. Reattach: `tmux attach -t gtm`

That's the whole foundation. Everything else in this chapter builds on those 8 steps.

---

## Key Takeaways

- tmux lets you run multiple terminal sessions in one window. Sessions survive closing your terminal. This is essential for running coding agents.
- The three-pane pattern (agent + logs + shell) is the standard layout for GTM work.
- SSH + tmux lets you run agents on remote machines and reconnect from anywhere.
- You need about 20 terminal commands for GTM work: counting lines, parsing JSON, querying databases, and monitoring processes.
- Start with iTerm2 split panes if tmux feels like too much. Graduate when you're ready.

---

**You've completed the GTM Coding Agent Starter Kit.**

You now have the mental models, the tools, and the workspace structure to run go-to-market with coding agents. Go back to [CLAUDE.md](../CLAUDE.md), type `help me set up` if you haven't already, and start building.

The best GTM system is the one you actually use. Make it yours.
