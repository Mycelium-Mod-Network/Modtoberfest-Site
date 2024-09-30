import {generateState} from "arctic";
import {github} from "@lib/auth.ts";

import type {APIContext} from "astro";

export async function GET(context: APIContext): Promise<Response> {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
        scopes: ["user:email", "read:org"]
    });

    context.cookies.set("github_oauth_state", state, {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    });

    return context.redirect(url.toString());
}