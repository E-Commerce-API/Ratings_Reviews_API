const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const db = require('../database/index.js');

const port = process.env.PORT || 4000;

app.get('/reviews', async (req, res) => {
  const getReviews = await db.Reviews.find();
  console.log('reviews', getReviews);
  res.send(200);
})

app.route('/reviews/meta')
  .get()

app.route('/reviews/:review_id/helpful')
  .put()

app.route('/reviews/:review_id/report')
  .put()

app.listen(port, () => {
  console.log(`SDC project listening at ${port}`);
});