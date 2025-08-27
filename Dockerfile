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

WORKDIR /app
COPY package.json package-lock.json schema.prisma ./
RUN npm ci

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
ENV HOST 0.0.0.0
ENV PORT 4321

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

COPY migrations ./migrations
COPY schema.prisma ./schema.prisma

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4321
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "./dist/server/entry.mjs"]
