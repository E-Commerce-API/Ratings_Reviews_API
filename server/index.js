const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const database = path.resolve(__dirname, 'database', 'index.js')
const db = require(database);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`SDC project listening at ${port}`);
});