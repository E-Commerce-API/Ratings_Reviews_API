const { Reviews } = require('../database/index.js');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const reviewFile = 'reviews.csv';
const reviewPath = path.resolve(__dirname, 'raw_data', reviewFile);

let reviewArray = [];
let count = 0;
const startTime = new Date();

const readReview = fs.createReadStream(reviewPath, { encoding: 'utf8' })
  .pipe(csv.parse({ headers: true }))
  .on('data', async data => {

    let review = new Reviews({
      _id: data.id,
      product_id: data.product_id,
      rating: data.rating,
      date: data.date,
      summary: data.summary,
      body: data.body,
      recommend: data.recommend,
      reported: data.reported,
      reviewer_name: data.reviewer_name,
      reviewer_email: data.reviewer_email,
      response: data.response,
      helpfulness: Number(data.helpfulness)
    })


    if (reviewArray.length === 1000) {
      readReview.pause();
      try {
        await Reviews.insertMany(reviewArray)
      } catch (err) {
        console.log(err.message)
      }
      let timeElapsed = new Date() - startTime;
      console.log(`${count} number of records inserted in ${timeElapsed}`)
      reviewArray = [];
      readReview.resume();
    } else {
      reviewArray.push(review);
      count++;
    }
  })
  .on('end', async () => {
    if (reviewArray.length) {
      await Reviews.insertMany(reviewArray);
      reviewArray = [];
    }
    console.log(`${count} records have been imported`)
  });