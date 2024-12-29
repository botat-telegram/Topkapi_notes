const createModel = () => ({
    chatId: "",
    userId: "",
    path: [],
    lastActivity: Date.now(), // Setting initial lastActivity time to current time
});

class Session {
    static stack = new Map();
    static sessionExpiryTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    constructor() {}

    getItem(key) {
        const session = Session.stack.get(key);
        // Check if the session has expired
        if (Date.now() - session?.lastActivity > Session.sessionExpiryTime) {
            this.removeItem(key); // Remove expired session
            throw new Error(`Session '${key}' has expired`);
        }
        return session;
    }

    setItem(key, value = createModel()) {
        if (Session.stack.has(key)) {
            this.removeItem(key);
        }

        Session.stack.set(key, value);
    }

    removeItem(key) {
        if (!Session.stack.has(key)) {
            throw new Error(`Key '${key}' not found in the session stack`);
        }
        Session.stack.delete(key);
    }

    updateLastActivity(key) {
        if (!Session.stack.has(key)) {
            throw new Error(`Key '${key}' not found in the session stack`);
        }
        const session = Session.stack.get(key);
        session.lastActivity = Date.now();
    }

    static clearExpiredSessions() {
        const now = Date.now();
        for (const [key, session] of Session.stack) {
            if (now - session.lastActivity > Session.sessionExpiryTime) {
                Session.stack.delete(key);
            }
        }
    }
}

module.exports = Session;
