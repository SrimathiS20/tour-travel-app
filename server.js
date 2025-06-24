const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Package submission endpoint
app.post('/submit-package', async (req, res) => {
    console.log('Received package submission:', req.body);
    try {
        const { packageName, destination } = req.body;
        if (!packageName || !destination) {
            throw new Error('Package name and destination are required');
        }
        console.log(`Adding package: ${packageName}, ${destination}`);
        await db.addPackage(packageName, destination);
        console.log('Package saved successfully');
        res.json({ message: 'Package details saved successfully' });
    } catch (error) {
        console.error('Error saving package:', error);
        res.status(500).json({ error: 'Failed to save package details', details: error.message });
    }
});

// Contact form submission endpoint
app.post('/submit-contact', async (req, res) => {
    console.log('Received contact submission:', req.body);
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            throw new Error('Name, email, and message are required');
        }
        console.log(`Adding contact: ${name}, ${email}`);
        await db.addContact(name, email, message);
        console.log('Contact saved successfully');
        res.json({ message: 'Contact details saved successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save contact details', details: error.message });
    }
});

// Get all contacts endpoint (for admin use)
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await db.getAllContacts();
        console.log('Retrieved contacts:', contacts);
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Get all packages endpoint (for admin use)
app.get('/packages', async (req, res) => {
    try {
        const packages = await db.getAllPackages();
        console.log('Retrieved packages:', packages);
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
