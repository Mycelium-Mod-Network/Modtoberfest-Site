# Install dependencies only when needed
FROM node:lts AS deps

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json schema.prisma ./
COPY migrations ./migrations
RUN npm ci
RUN npm run deploy-db

# Rebuild the source code only when needed
FROM node:lts AS builder

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:lts AS runner

ARG GITHUB_ID
ARG GITHUB_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL

ENV GITHUB_ID $GITHUB_ID
ENV GITHUB_SECRET $GITHUB_SECRET
ENV DATABASE_URL $DATABASE_URL
ENV ADMIN_SECRET $ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL $DISCORD_WEBHOOK_URL

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
