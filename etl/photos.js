const { Reviews, Photos, Characteristics } = require('../database/index.js');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const reviewFile = 'reviews_photos.csv';
const reviewPath = path.resolve(__dirname, 'raw_data', reviewFile);

let photosArray = [];
let count = 0;
const startTime = new Date();

const readReview = fs.createReadStream(reviewPath, { encoding: 'utf8' })
  .pipe(csv.parse({ headers: true }))
  .on('data', async data => {

    let photo = new Photos({
      review_id: data.review_id,
      url: data.url
    })

    if (photosArray.length === 1000) {
      readReview.pause();
      // await Photos.insertMany(photosArray);
      (async () => {
        await photosArray.forEach(async photo => {
          let findReview = await Reviews.updateOne(
            { review_id: photo.review_id },
            { $push: { photos: photo } })
        })
      })()
      let timeElapsed = new Date() - startTime;
      console.log(`${count} number of records inserted in ${timeElapsed}`)
      photosArray = [];
      readReview.resume();
    } else {
      photosArray.push(photo);
      count++;
    }
  })
  .on('end', async () => {
    if (array.length) {
      (async () => {
        await photosArray.forEach(async photo => {
          let findReview = await Reviews.updateOne(
            { review_id: photo.review_id },
            { $push: { photos: photo } })
        })
      })()
      photosArray = [];
    }
    console.log('Data has been imported')
  });