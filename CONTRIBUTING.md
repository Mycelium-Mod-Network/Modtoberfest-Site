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
    - Set the "Homepage URL" to `http://127.0.0.1:4321`.
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
    - Put the app client secret after the `GITHUB_SECRET=` line.
    - Put your own randomly-generated secret after the `ADMIN_SECRET=` line.
5. Bring up the database through Docker:
   ```bash
   sudo docker compose -f docker-compose-dev.yml up db
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

Follow the section below on granting admin access through the API for an initial user.

### Shutdown

To bring the site down gracefully:

1. Bring down the database:
   ```bash
   sudo docker compose -f docker-compose-dev.yml down db
   ```
2. Terminate the `npm run dev` command using the `CTRL + C` keyboard shortcut.

## Admin API endpoints

The following sections involve the use of the admin API endpoints under `/api/admin`. These endpoints generally require
a POST request with a JSON object payload, where the JSON object always has a `secret` property. That `secret` property
should contain the value of the `ADMIN_SECRET` from the `.env` file.

Certain admin API endpoints may require additional input data, which is supplied through the JSON object payload.

You may see all extant admin API endpoints by looking under the `src/pages/api/admin` directory. For example, 
`src/pages/api/admin/givemethepower.ts` corresponds to the `/api/admin/givemethepower` API endpoint.

For convenience, this guide will provide invocations to invoke the admin API endpoints. These invocations will assume
that the shell environment contains the `ADMIN_SECRET` variable from the `.env` file. Use the following commands to 
import the contents of the `.env` file into the shell environment:

- For Linux `bash`:
    ```bash
    source .env
    ```
- For Windows PowerShell:
    ```pwsh
    Get-Content .env | foreach {
        $name, $value = $_.split('=')
        Set-Content env:$name $value
    }
    ```

### Obtaining admin access

To gain access to the administrator panel for an initial user, you can POST to the `/api/admin/givemethepower` API 
endpoint, with an additional required `github_id` property containing the GitHub user ID for the user to be given
admin access.

Once an initial user has administrator panel access, they can control further access by promoting and demoting users
from the administrator panel.

Your GitHub user ID can be found by visiting `https://api.github.com/users/<username>`, replacing `<username>` with
your GitHub username, and checking the `id` field in the resulting JSON response.

- For Linux `bash`: 
   ```bash
   export GITHUB_USER_ID=<replace with user ID>
   ```
   ```bash
   curl \
     -H "Content-Type: application/json" \
     -d "{\"secret\":\"$ADMIN_SECRET\",\"github_id\":\"$GITHUB_USER_ID\"}" \
     http://localhost:4321/api/admin/givemethepower
   ```
- For Windows PowerShell:
   ```pwsh
   $env:GITHUB_USER_ID=<replace with user ID>
   ```
   ```pwsh
   Invoke-RestMethod `
     -Method 'Post' `
     -ContentType "application/json" `
     -Body "{""secret"":""$env:ADMIN_SECRET"",""github_id"":""$env:GITHUB_USER_ID""}" `
     -Uri http://localhost:4321/api/admin/givemethepower
   ```

### Languages data

Before any repository can be submitted or added, the database's languages data must be updated by a POST request to the
`/api/admin/languages/collect` endpoint.

This must be done at least once after initial setup of the database, and should be done every so often to ensure the
languages data is up to date with GitHub Linguist's data.

- For Linux `bash`:
   ```bash
   curl \
     -H "Content-Type: application/json" \
     -d "{\"secret\":\"$ADMIN_SECRET\"}" \
     http://localhost:4321/api/admin/languages/collect
   ```
- For Windows PowerShell:
   ```pwsh
   Invoke-RestMethod `
     -Method 'Post' `
     -ContentType "application/json" `
     -Body "{""secret"":""$env:ADMIN_SECRET""}" `
     -Uri http://localhost:4321/api/admin/languages/collect
   ```

### Pull requests collection

The site does not collect pull requests from registered repositories on a real-time basis. Instead, it relies on an
administrator-configured scheduled job (such as a `cron` job) to periodically POST to the 
`/api/admin/pull_requests/collect` endpoint.

When testing the site, this should be done after creating any pull requests to registered repositories. The site will
collect pull requests made within the hardcoded period between October and November; see the definitions in 
`src/pages/api/admin/pull_requests/collect.ts` for `OCTOBER_START` and `NOVEMBER_START` for the exact times.

- For Linux `bash`:
   ```bash
   curl \
     -H "Content-Type: application/json" \
     -d "{\"secret\":\"$ADMIN_SECRET\"}" \
     http://localhost:4321/api/admin/pull_requests/collect
   ```
- For Windows PowerShell:
   ```pwsh
   Invoke-RestMethod `
     -Method 'Post' `
     -ContentType "application/json" `
     -Body "{""secret"":""$env:ADMIN_SECRET""}" `
     -Uri http://localhost:4321/api/admin/pull_requests/collect
   ```
