const { QuickDB } = require('quick.db');
const db = new QuickDB();

// Compatibility layer for legacy synchronous code
const syncDb = {
    get: (key) => {
        return db.get(key);
    },
    set: (key, value) => {
        return db.set(key, value);
    },
    delete: (key) => {
        return db.delete(key);
    },
    has: (key) => {
        return db.has(key);
    },
    fetch: (key) => {
        return db.get(key);
    },
    add: (key, value) => {
        return db.add(key, value);
    },
    subtract: (key, value) => {
        return db.sub(key, value);
    },
    push: (key, value) => {
        return db.push(key, value);
    },
    all: () => {
        return db.all();
    },
    deleteAll: () => {
        return db.deleteAll();
    }
};

module.exports = syncDb;
