/*
 * Schema Example for a NoSQL database utilizing MongoDB and Mongoose
 */


const eachReviewSchema = new mongoose.Schema({
  product_id: Number,
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Photos'
  }],
  characteristics: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Each_Characteristic'
  }]
});

const photoSchema = new mongoose.Schema({
  id: Number,
  url: String
});

const eachCharacteristicSchema = new mongoose.Schema({
  characteristic_id: Number,
  name: String,
  value: Number
})