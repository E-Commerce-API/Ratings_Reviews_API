const { CharacteristicReviews } = require('../database/index.js');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

const characteristicsFile = 'characteristic_reviews.csv';
const characteristicsPath = path.resolve(__dirname, 'raw_data', characteristicsFile);

let characteristicsArray = [];
let count = 0;
const startTime = new Date();

const readCharacteristics = fs.createReadStream(characteristicsPath, { encoding: 'utf8' })
  .pipe(csv.parse({ headers: true }))
  .on('data', async data => {

    let characteristic = new CharacteristicReviews({
      characteristic_id: data.characteristic_id,
      review_id: data.review_id,
      value: data.value
    })
// console.log(characteristicsArray)
    if (characteristicsArray.length === 1000) {
      readCharacteristics.pause();
      await CharacteristicReviews.insertMany(characteristicsArray)
      let timeElapsed = new Date() - startTime;
      console.log(`${count} number of records inserted in ${timeElapsed}`)
      characteristicsArray = [];
      readCharacteristics.resume();
    } else {
      characteristicsArray.push(characteristic);
      count++;
    }
  })
  .on('end', async () => {
    if (characteristicsArray.length) {
      await CharacteristicReviews.insertMany(characteristicsArray)
      characteristicsArray = [];
    }
    console.log(`${count} records have been imported`)
  });