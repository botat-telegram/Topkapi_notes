const createModel = () => ({
    chatId: "",
    userId: "",
    path: [],
    lastActivity: 0
});

class Session {
    static stack = new Map();

    constructor() {}

    getItem(key) {
        if (!Session.stack.has(key)) {
            throw new Error(`Key '${key}' not found in the session stack`);
        }
        return Session.stack.get(key);
    }

    setItem(key, value = createModel()) {
        Session.stack.set(key, value);
    }

    static removeItem(key) {
        if (!Session.stack.has(key)) {
            throw new Error(`Key '${key}' not found in the session stack`);
        }
        Session.stack.delete(key);
    }
}


module.exports = Session