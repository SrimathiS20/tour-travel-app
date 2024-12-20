const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/submit-package', (req, res) => {
    const { packageName, destination } = req.body;
    console.log(`Package Name: ${packageName}, Destination: ${destination}`);
    res.json({ message: 'Package details received' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// Handling Contact Form Submission
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Contact Form Submission:
        Name: ${name}, 
        Email: ${email}, 
        Message: ${message}`);
    res.json({ message: 'Contact details received' });
});
