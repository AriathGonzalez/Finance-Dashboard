// index.js
const express = require('express');
const dotenv = require('dotenv');
const searchRoute = require('./routes/search');

dotenv.config();
const app = express();
const port = 3001;

app.use(express.json());
app.use('/', searchRoute); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
