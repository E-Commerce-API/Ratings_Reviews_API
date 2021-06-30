require('newrelic')
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const { Reviews, Photos, Characteristics } = require('../database/index.js');
const { getReviews, getMeta, addReview, updateHelpfulness, updateReported } = require('../routes/index.js');

// if (config.util.getEnv('NODE_ENV') !== 'test') {
//   app.use(morgan('tiny'));
// }

const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.route('/reviews')
  .get(getReviews)
  .post(addReview)

app.route('/reviews/meta')
  .get(getMeta)

app.route('/reviews/:review_id/helpful')
  .put(updateHelpfulness)

app.route('/reviews/:review_id/report')
  .put(updateReported)

app.listen(port, () => {
  console.log(`SDC project listening at ${port}`);
});