const { Reviews, Photos, Characteristics } = require('../database/index.js');
const fs = require('fs');
const path = require('path');

const reviewFile = 'reviews.csv';
const reviewPath = path.resolve(__dirname, 'raw_data', reviewFile);
const readReview = fs.createReadStream(reviewPath, { encoding: 'utf8' });

let lineRemainder = '';

readReview.on('data', async (chunk) => {
  // readReview.pause();
  let lines = chunk.split('\n');
  lines[0] = lineRemainder + lines[0];
  lineRemainder = lines.pop();

  lines.forEach( async (line) => {
    line = line.split(',');
    try {
      let review = new Reviews({
        review_id: line[0],
        product_id: line[1],
        rating: line[2],
        date: line[3],
        summary: line[4],
        body: line[5],
        recommend: Boolean(line[6]),
        reported: Boolean(line[7]),
        reviewer_name: line[8],
        reviewer_email: line[9],
        response: line[10],
        helpfulness: Number(line[11])
      });
      let newReview = await review;
      let savedReview = await newReview.save();
    } catch (err) {
      console.log(err.message);
    } finally {
      console.log('Record saved')
    }
  })
});

readReview.on('end', () => {
  console.log('ended')
})