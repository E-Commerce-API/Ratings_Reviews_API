const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const db = require('../database/index.js');

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`SDC project listening at ${port}`);
});