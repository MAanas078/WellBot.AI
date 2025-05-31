const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const db = new sqlite3.Database('./feedback.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create feedback table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usefulness INTEGER,
        accuracy INTEGER,
        comments TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// API Key for basic security (replace with your own key)
const API_KEY = 'API_KEY';

// Middleware to check API key
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
};

// Endpoint to save feedback
app.post('/api/feedback', authenticateAPIKey, (req, res) => {
  const { usefulness, accuracy, comments } = req.body;
  if (!usefulness || !accuracy) {
    return res.status(400).json({ error: 'Usefulness and accuracy are required' });
  }

  const stmt = db.prepare('INSERT INTO feedback (usefulness, accuracy, comments) VALUES (?, ?, ?)');
  stmt.run(usefulness, accuracy, comments, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save feedback' });
    }
    res.status(200).json({ message: 'Feedback saved successfully' });
  });
  stmt.finalize();
});

// Endpoint to retrieve feedback (for developer only)
app.get('/api/feedback', authenticateAPIKey, (req, res) => {
  db.all('SELECT * FROM feedback ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
    res.status(200).json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
