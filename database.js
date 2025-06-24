const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database connection
const dbPath = path.join(__dirname, 'travel_app.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
db.serialize(() => {
    // Create contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating contacts table:', err);
        } else {
            console.log('Contacts table ready');
        }
    });

    // Create packages table for future use
    db.run(`CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name TEXT NOT NULL,
        destination TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating packages table:', err);
        } else {
            console.log('Packages table ready');
        }
    });
});

// Database operations
const dbOperations = {
    // Add a new contact submission
    addContact: (name, email, message) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
            db.run(sql, [name, email, message], function(err) {
                if (err) {
                    console.error('Error in addContact:', err);
                    reject(err);
                } else {
                    console.log('Contact added with ID:', this.lastID);
                    resolve(this.lastID);
                }
            });
        });
    },

    // Add a new package submission
    addPackage: (packageName, destination) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO packages (package_name, destination) VALUES (?, ?)';
            db.run(sql, [packageName, destination], function(err) {
                if (err) {
                    console.error('Error in addPackage:', err);
                    reject(err);
                } else {
                    console.log('Package added with ID:', this.lastID);
                    resolve(this.lastID);
                }
            });
        });
    },

    // Get all contacts
    getAllContacts: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM contacts ORDER BY created_at DESC';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error in getAllContacts:', err);
                    reject(err);
                } else {
                    console.log('Retrieved contacts:', rows);
                    resolve(rows);
                }
            });
        });
    },

    // Get all packages
    getAllPackages: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM packages ORDER BY created_at DESC';
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error in getAllPackages:', err);
                    reject(err);
                } else {
                    console.log('Retrieved packages:', rows);
                    resolve(rows);
                }
            });
        });
    }
};

module.exports = dbOperations; 