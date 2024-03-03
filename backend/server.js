const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
const PORT = 5001;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

// API endpoint to fetch records from the database
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await db.query('SELECT * FROM employees');
    res.json(employees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
