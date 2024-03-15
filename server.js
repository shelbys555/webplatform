const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // You can change this port if needed

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost', // Change this to your MySQL host if needed
  user: 'root', // Change this to your MySQL username if needed
  password: 'ByOrofPBlis@6', // Change this to your MySQL password if needed
  database: 'mydatabase' // Change this to your database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Serve login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
  // Retrieve username and password from request body
  const { username, password } = req.body;

  // Query the database for the user with the provided username and password
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error authenticating user:', err);
      return res.status(500).send('Internal server error');
    }

    // Check if the query returned any rows (i.e., if the credentials are valid)
    if (results.length > 0) {
      // Authentication successful
      res.redirect('/dashboard.html'); // Redirect to dashboard page
    } else {
      // Invalid username or password
      res.redirect('/');
    }
  });
});

// Handle registration form submission
app.post('/register', (req, res) => {
  // Retrieve registration data from request body
  const { username, password, id } = req.body;

  // Insert registration data into MySQL database
  const sql = 'INSERT INTO users (id, username, password) VALUES (?, ?, ?)';
  const values = [id, username, password];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting registration data into MySQL:', err);
      return res.status(500).send('Error inserting registration data into database.');
    }

    console.log('Registration data inserted into MySQL:', result);
    res.redirect('/index.html');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
