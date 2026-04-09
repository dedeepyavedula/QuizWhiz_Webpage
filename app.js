const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Database
const db = new sqlite3.Database('QW.db');

// Create tables
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    subject TEXT,
    score INTEGER
)`);



// Default route
app.get('/', (req, res) => {
    res.redirect('/register.html');
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
            if (err) return res.send("Error registering");
            res.redirect('/login.html');
        }
    );
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, row) => {
            if (row) {
                req.session.username = username; // store user
                res.redirect('/home.html');
            } else {
                res.send("Login Failed");
            }
        }
    );
});


app.post('/saveResult', (req, res) => {
    const username = req.session.username;
    const { subject, score } = req.body;

    if (!username) {
        return res.send("Not logged in");
    }

    db.run(
        "INSERT INTO results (username, subject, score) VALUES (?, ?, ?)",
        [username, subject, score],
        (err) => {
            if (err) return res.send("Error saving result");
            res.send("Result saved");
        }
    );
});


app.get('/results', (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.json([]);
    }

    db.all(
        "SELECT subject, score FROM results WHERE username=?",
        [username],
        (err, rows) => {
            res.json(rows);
        }
    );
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
