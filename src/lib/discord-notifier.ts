const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const LEVELS = {
    ERROR: "error",
    WARN: "warn",
    INFO: "info"
};

const COLORS: Record<string, number> = {
    error: 16711680,
    warn: 16776960,
    info: 65280
};

async function send(embeds: any) {
    if (!WEBHOOK_URL) {
        return;
    }

    const body = {
        username: "Modtoberfest",
        avatar_url: "https://modtoberfest.com/logo/png/badge_bg/2025.png",
        embeds
    };

    const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function log(level: string, title: string, description: string | null, fields: any) {
    if (!WEBHOOK_URL) {
        console.log(`[${level}]: ${title} (${description})`);
        return;
    }

    const embed = {
        title,
        description,
        fields,
        color: COLORS[level],
        timestamp: new Date().toISOString()
    };

    return send([embed]);
}

export async function warn(title: string, description: string | null, fields: any) {
    return log(LEVELS.WARN, title, description, fields);
}

export async function error(title: string, description: string | null, fields: any) {
    return log(LEVELS.ERROR, title, description, fields);
}

export async function info(title: string, description: string | null, fields: any) {
    return log(LEVELS.INFO, title, description, fields);
}
