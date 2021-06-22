const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`SDC project listening at ${port}`);
});