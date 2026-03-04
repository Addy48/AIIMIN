class DevLogger {
    constructor() {
        this.subscribers = [];
        this.logs = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        // Initially push historical logs
        callback([...this.logs]);

        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    logOperation(payload, response) {
        // Only log in pure development mode
        if (process.env.NODE_ENV !== 'development') return;

        const logEntry = {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            timestamp: Date.now(),
            payload,
            response
        };

        this.logs = [logEntry, ...this.logs].slice(0, 50); // Keep last 50
        this.notify();
    }

    notify() {
        this.subscribers.forEach(callback => callback([...this.logs]));
    }
}

export const devLogger = new DevLogger();
