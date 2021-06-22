const fs = require('fs');
const path = require('path');

const reviewFile = 'reviews.csv';
const reviewPath = path.resolve(__dirname, 'raw_data', reviewFile);
const readReview = fs.createReadStream(reviewPath, { encoding: 'utf8' });


readReview.on('data', chunk => {
  readReview.pause();
  let line = chunk.split('\n');

  console.log(line[0]);
});