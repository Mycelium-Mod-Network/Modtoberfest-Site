/// <reference path="../.astro/types.d.ts" />

/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        session: import("lucia").Session | null;
        user: import("lucia").User | null;
    }
}

interface ImportMetaEnv {
    readonly GITHUB_ID: string;
    readonly GITHUB_SECRET: string;
    readonly DATABASE_URL: string;
    readonly ADMIN_SECRET: string;
    readonly DISCORD_WEBHOOK_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}