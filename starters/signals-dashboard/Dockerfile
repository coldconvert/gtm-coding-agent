FROM node:20-alpine AS base

# ── deps: install all dependencies ──────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── builder: compile the Next.js app ────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build args are available at build time for NEXT_PUBLIC_* vars if needed
RUN npm run build

# ── runner: minimal production image ────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Fly.io uses PORT env var; Next.js standalone server reads it automatically
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

# Standalone output: self-contained server.js + bundled node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets (JS chunks, CSS) served by the standalone server
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

# next.config.ts output:'standalone' produces this server.js at root
CMD ["node", "server.js"]
