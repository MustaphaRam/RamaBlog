// server.js
const express = require('express');
const db = require('./db');
const app = express();

// check connection
db.con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', (req, res) => {
  res.json('Hello In Rama Blog!');
});

const port = 3800;
app.listen(8300, () => {
  console.log(`app listening at http://localhost:${port}`);
});