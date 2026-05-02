require('dotenv').config();

const LOG_API = 'http://20.207.122.201/evaluation-service/logs';

// i kept getting weird errors when token was undefined so added this check
function getToken() {
    const token = process.env.ACCESS_TOKEN;
    if (!token) {
        throw new Error('ACCESS_TOKEN not found in .env file');
    }
    return token;
}

// main logging function - calls the affordmed log api
// stack = frontend/backend
// level = debug/info/warn/error/fatal
// pkg = which part of code is logging (component, page, api etc)
// message = what actually happened
async function Log(stack, level, pkg, message) {
    try {
        const token = getToken();

        const body = {
            stack: stack,
            level: level,
            package: pkg,
            message: message
        };

        const res = await fetch(LOG_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        // handle non-200 responses
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Log API returned ${res.status}: ${errText}`);
        }

        const data = await res.json();
        return data;

    } catch (err) {
        // cant use Log here obviously since logger itself failed
        // just printing to console so at least we know something went wrong
        console.error('[logging_middleware] Failed to send log:', err.message);
    }
}

module.exports = { Log };