class Session {
    static stack = new Map();
    static sessionExpiryTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    constructor(key) {
        this.key = key;
    }

    getItem() {
        const session = Session.stack.get(this.key);
        // Check if the session has expired
        if (session && Date.now() - session.lastActivity > Session.sessionExpiryTime) {
            this.removeItem(); // Remove expired session
            throw new Error(`Session '${this.key}' has expired`);
        }
        return session;
    }

    setItem(value) {
        value.lastActivity = Date.now();
        Session.stack.set(this.key, value);
    }

    removeItem() {
        if (!Session.stack.has(this.key)) {
            throw new Error(`Key '${this.key}' not found in the session stack`);
        }
        Session.stack.delete(this.key);
    }

    getPath() {
        const session = this.getItem();
        return session?.path || [];
    }

    setCurrentFolder(folder) {
        const session = this.getItem();
        if (!session) {
            throw new Error(`Session with key '${this.key}' does not exist or has expired`);
        }
        session.currentFolder = folder;
        this.setItem(session); // Persist updated session
    }

    getCurrentFolder() {
        const session = this.getItem();
        if (!session) {
            throw new Error(`Session with key '${this.key}' does not exist or has expired`);
        }
        return session.currentFolder || null;
    }

    is_admin() {
        const session = this.getItem();
        return session?.admin;
    }
    
    getEvent() {
        const session = this.getItem();
        return session?.event;
    }

    updateLastActivity() {
        const session = this.getItem();
        if (!session) {
            throw new Error(`Key '${this.key}' not found in the session stack`);
        }
        session.lastActivity = Date.now();
        this.setItem(session); // Persist updated session
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
