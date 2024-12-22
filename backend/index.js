const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db.js');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
const PORT = 3008;

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
  const { username, email, phone, password, role} = req.body;

  if (!username || !email || !phone || !password || !role) {
    return res.status(400).json({ message: 'All fields are required'});
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const checkUser = await pool.query(
      'SELECT * FROM Users WHERE email = $1 OR phone = $2',
      [email, phone]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email or phone exists' });
    }

    const result = await pool.query(
      'INSERT INTO Users (username, email, phone, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, phone, hashedPassword, role]
    );

    res.status(201).json({
      message: 'Registered Successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fields can't be empty"});
  }

  try {

    const user = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    isMatch = await bcrypt.compare(password , user.rows[0].password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {email : email},
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
