const { Reviews, Photos, Characteristics } = require('../database/index.js');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const photoFile = 'reviews_photos.csv';
const photoPath = path.resolve(__dirname, 'raw_data', photoFile);

let photosArray = [];
let count = 0;
const startTime = new Date();

const readPhotos = fs.createReadStream(photoPath, { encoding: 'utf8' })
  .pipe(csv.parse({ headers: true }))
  .on('data', async data => {

    let photo = new Photos({
      _id: data.id,
      review_id: data.review_id,
      url: data.url
    })

    // readPhotos.pause();
    // let findReview = await Reviews.updateOne(
    //   { review_id: photo.review_id },
    //   { $push: { photos: photo } })
    // count++;
    // readPhotos.resume();
    // if (count === 1000) {
    //   let timeElapsed = new Date() - startTime;
    //   console.log(`${count} number of records inserted in ${timeElapsed}`)
    // }


    if (photosArray.length === 1000) {
      readPhotos.pause();
      // (async () => {
      //   await photosArray.forEach(async photo => {
      //     let findReview = await Reviews.updateOne(
      //       { review_id: photo.review_id },
      //       { $push: { photos: photo } })
      //   })
      // })()
      await Photos.insertMany(photosArray)
      let timeElapsed = new Date() - startTime;
      console.log(`${count} number of records inserted in ${timeElapsed}`)
      photosArray = [];
      readPhotos.resume();
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