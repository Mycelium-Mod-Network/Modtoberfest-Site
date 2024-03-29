# Install dependencies only when needed
FROM node:16-alpine AS deps

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL
ARG NEXTAUTH_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL
ENV NEXTAUTH_URL $NEXTAUTH_URL

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json schema.prisma ./
COPY migrations ./migrations
RUN npm ci
RUN npm run deploy-db

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL
ARG NEXTAUTH_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL
ENV NEXTAUTH_URL $NEXTAUTH_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL
ARG NEXTAUTH_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL
ENV NEXTAUTH_URL $NEXTAUTH_URL

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1002 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
RUN npx next telemetry disable

CMD ["npm", "start"]
