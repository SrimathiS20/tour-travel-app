const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Package submission endpoint
app.post('/submit-package', (req, res) => {
    const { packageName, destination } = req.body;
    console.log(`Package Name: ${packageName}, Destination: ${destination}`);
    res.json({ message: 'Package details received' });
});

// Contact form submission endpoint
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Contact Form Submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    res.json({ message: 'Contact details received' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
