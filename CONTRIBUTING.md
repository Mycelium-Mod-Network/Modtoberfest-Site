The website runs using the [Astro](https://astro.build/) framework, with authentication handled through GitHub via an
OAuth app and a database backend using MariaDB and [Prisma](https://www.prisma.io/).

## Prerequisites

To setup the Modtoberfest-Site to run locally for development, you will first need the following:

- `npm`, particularly for running Astro (for the site itself) and Prisma (for database migrations).
- Docker and docker-compose, to run the dev database.
- A GitHub OAuth app, for authentication. (See the next section on how to create one)

### Creating a GitHub OAuth App

1. On GitHub, go to [`Settings > Developer settings > OAuth Apps`](https://github.com/settings/developers).
2. Click on the "New OAuth App" button.
3. Fill in the required elements for the OAuth app:
    - Set the "Application name" to anything (though likely use an identifiable name like "Modtoberfest-Site-Dev").
    - Set the "Homepage URL" to `http://127.0.0.1:3000`.
    - Set the "Authorization callback URL" to `http://localhost:4321/auth/github/callback`.
    - Leave un-ticked the "Enable Device Flow" checkbox.
4. Click on the "Register application" button.
5. Take note of the "**Client ID**" for later.
6. Beside the "Client secrets" header, click the "Generate a new client secret" button.
7. Copy the displayed **client secret** for later.

After creating the OAuth app, you should have the _app client ID_ and _app client secret_.

## Setup

1. Clone the repository locally.
2. Install all the necessary dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file into an `.env` file. (The copied file is git-ignored.)
4. In the newly-copied `.env` file:
    - Put the app client ID after the `GITHUB_ID=` line.
    - Put the app client secret after the `GITHUB_SECRET=line`.
5. Bring up the database through Docker:
   ```bash
   docker compose -f docker-compose-dev.yml up db
   ```
6. Initialize the database:
   ```bash
   npm run migrate
   ```
7. Bring up the local site server:
   ```bash
   npm run dev
   ```

After those steps, you should have a local copy of the site accessible at http://localhost:4321/ (which should be noted
in the console output.)

### Shutdown

To bring the site down gracefully:

1. Bring down the database:
   ```bash
   docker compose -f docker-compose-dev.yml down db
   ```
2. Terminate the `npm run dev` command using the `CTRL + C` keyboard shortcut.
