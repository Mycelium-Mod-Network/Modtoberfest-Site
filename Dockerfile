# Stage 1: Install Dependencies
# This stage only installs dependencies and caches them.
FROM node:lts AS deps

WORKDIR /app

# Copy the minimum files needed for dependency installation
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm ci

# Stage 2: Build the Application
# This stage builds the Astro project and generates the Prisma client.
FROM node:lts AS builder

WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules/

# Copy the rest of the application source code
COPY . .

# Generate the Prisma Client
# This is crucial for your application to interact with the database
RUN npx prisma generate

# Build the Astro project for production
RUN npm run build

# Stage 3: The Production Runner Image
# This is the final, slim image that will run your application.
FROM node:lts-alpine AS runner

# Set the working directory
WORKDIR /app

# Install OpenSSL
# This is crucial for Prisma to work correctly on Alpine
RUN apk update && apk add --no-cache openssl ca-certificates

# Set production environment variables
# This is where your secrets should be defined
ARG GITHUB_ID
ARG GITHUB_SECRET
ARG DATABASE_URL
ARG ADMIN_SECRET
ARG DISCORD_WEBHOOK_URL

ENV GITHUB_ID=$GITHUB_ID
ENV GITHUB_SECRET=$GITHUB_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV ADMIN_SECRET=$ADMIN_SECRET
ENV DISCORD_WEBHOOK_URL=$DISCORD_WEBHOOK_URL

# Copy the build artifacts from the builder stage
# We only need the compiled code and a lean set of dependencies.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Copy only production dependencies and the Prisma client files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/schema.prisma ./schema.prisma
COPY --from=builder /app/package.json ./package.json

# You may also need to copy the Prisma engine binary.
# The `prisma generate` command should handle this automatically by placing it in the correct path.
# However, if you encounter errors, you may need to manually copy it.
# COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

ENV HOST=0.0.0.0

# Expose the port
EXPOSE 4321

# The command to run the Astro application
CMD ["node", "./dist/server/entry.mjs"]
