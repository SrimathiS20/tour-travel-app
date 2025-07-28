const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Connect to SQLite database
const db = new sqlite3.Database('./travel_app.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("Contacts table ready");

    // Drop existing packages table if exists
    db.run(`DROP TABLE IF EXISTS packages`, (err) => {
      if (err) {
        console.error('Error dropping packages table:', err);
        return;
      }
      
      // Create packages table with correct schema
      db.run(`CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name TEXT NOT NULL,
        destination TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        duration TEXT NOT NULL,
        meals TEXT NOT NULL,
        accommodation TEXT NOT NULL,
        transportation TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        special_offer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
      console.log("Packages table recreated with correct schema");
    });

    // Create reviews table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      destination TEXT NOT NULL,
      rating INTEGER NOT NULL,
      review_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("Reviews table ready");

    // Create bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      travel_date DATE NOT NULL,
      num_travelers INTEGER NOT NULL,
      special_requests TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (package_id) REFERENCES packages (id)
    )`);
    console.log("Bookings table ready");
  }
});

// Get all reviews
app.get('/get-reviews', (req, res) => {
  db.all('SELECT * FROM reviews ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ reviews: rows });
  });
});

// Submit a new review
app.post('/submit-review', (req, res) => {
  const { name, destination, rating, review_text } = req.body;
  
  if (!name || !destination || !rating || !review_text) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const sql = `INSERT INTO reviews (name, destination, rating, review_text) VALUES (?, ?, ?, ?)`;
  const values = [name, destination, rating, review_text];

  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Review added successfully",
      reviewId: this.lastID
    });
  });
});

// Contact form submission
app.post('/submit-contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
  const values = [name, email, message];

  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Contact form submitted successfully",
      contactId: this.lastID
    });
  });
});

// Submit a booking
app.post('/submit-booking', (req, res) => {
  const { 
    package_id,
    name,
    email,
    phone,
    travel_date,
    num_travelers,
    special_requests 
  } = req.body;
  
  if (!package_id || !name || !email || !phone || !travel_date || !num_travelers) {
    res.status(400).json({ error: "All required fields must be filled" });
    return;
  }

  const sql = `INSERT INTO bookings (
    package_id,
    name,
    email,
    phone,
    travel_date,
    num_travelers,
    special_requests
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [
    package_id,
    name,
    email,
    phone,
    travel_date,
    num_travelers,
    special_requests || null
  ];

  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Booking submitted successfully",
      bookingId: this.lastID
    });
  });
});

// Get all bookings
app.get('/get-bookings', (req, res) => {
  db.all(`
    SELECT b.*, p.package_name, p.destination 
    FROM bookings b 
    JOIN packages p ON b.package_id = p.id 
    ORDER BY b.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ bookings: rows });
  });
});

// Submit a package
app.post('/submit-package', (req, res) => {
  const { 
    package_name, 
    destination, 
    price,
    duration,
    meals,
    accommodation,
    transportation,
    description,
    category,
    special_offer 
  } = req.body;
  
  if (!package_name || !destination || !price || !duration || !meals || !accommodation || !transportation || !description || !category) {
    res.status(400).json({ error: "All required fields must be filled" });
    return;
  }

  const sql = `INSERT INTO packages (
    package_name, 
    destination, 
    price,
    duration,
    meals,
    accommodation,
    transportation,
    description,
    category,
    special_offer
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [
    package_name, 
    destination, 
    price,
    duration,
    meals,
    accommodation,
    transportation,
    description,
    category,
    special_offer || null
  ];

  db.run(sql, values, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "Package submitted successfully",
      packageId: this.lastID
    });
  });
});

// Get all packages
app.get('/get-packages', (req, res) => {
  db.all('SELECT * FROM packages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Retrieved packages:', rows);
    res.json({ packages: rows });
  });
});

// Get all contacts
app.get('/get-contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Retrieved contacts:', rows);
    res.json({ contacts: rows });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
