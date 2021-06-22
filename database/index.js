const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sdc', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', () => console.log(error.message));
db.once('open', () => console.log('Successfully connected to SDC database'));

const reviewSchema = new mongoose.Schema({
  product_id: Number,
  review_id: Number,
  rating: Number,
  summary: String,
  response: String,
  date: String,
  reviewer_name: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Photos'
  }],
  characteristics: [{
    type: mongoose.Schema.Types.Mixed,
    ref: 'Characteristics'
  }]
});

module.exports.Reviews = mongoose.model('Reviews', reviewSchema);

const photoSchema = new mongoose.Schema({
  id: Number,
  url: String,
});

module.exports.Photos = mongoose.model('Photos', photoSchema);

const characteristicSchema = new mongoose.Schema({
  characteristic_id: Number,
  name: String,
  value: Number,
});

module.exports.Characteristics = mongoose.model('Characteristics', characteristicSchema);





// let testReview = new Reviews({
//   product_id: 19653,
//   review_id: 635623,
//   rating: 4,
//   summary: 'This is a summary',
//   response: null,
//   date: '2020-09-17T00:00:00.000Z',
//   reviewer_name: 'chich',
//   helpfulness: 4,
//   reported: false,
// });

// let testPhotos = new Photos({
//   id: 141512,
//   url: 'www.photo.com/photo?cat=dog'
// });

// let testCharacteristic = new Characteristics({
//   characteristic_id: 561351,
//   name: 'Fabric',
//   value: 135
// });

// const addPhoto = async () => {
//   try {
//     let newPhoto = await testPhotos;
//     let savedPhoto = await newPhoto.save();

//     let getReview = await Reviews.findOne({ review_id: 635623 });
//     getReview.photos.push(savedPhoto);
//     let response = await getReview.save();
//   } catch (err) {
//     console.log(err.message)
//   } finally {
//     console.log('Photo saved')
//   }
// }

// const addCharacteristic = async () => {
//   try {
//     let newCharacteristic = await testCharacteristic;
//     let savedCharacteristic = await newCharacteristic.save()

//     let getReview = await Reviews.findOne({ review_id: 635623 });

//     getReview.characteristics.push(savedCharacteristic);
//     let response = await getReview.save();
//   } catch (err) {
//     console.log(err.message)
//   } finally {
//     console.log('Characteristic saved')
//   }
// }

// testReview.save()
//   .then(result => {
//     addPhoto()
//     addCharacteristic()
//   })
//   .catch(err => console.log(err.message));

