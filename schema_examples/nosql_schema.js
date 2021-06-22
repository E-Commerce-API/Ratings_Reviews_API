/*
 * Schema Example for a NoSQL database utilizing MongoDB and Mongoose
*/


const reviewSchema = new mongoose.Schema({
  product: Number,
  results: [eachReviewSchema]
});

const eachReviewSchema = new mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: [photoSchema],
  reported: Boolean
});

const photoSchema = new mongoose.Schema({
  id: Number,
  url: String
});

/* -------------------- */

const ratingSchema = new mongoose.Schema({
  product_id: Number,
  ratings: [{
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  }],
  recommend: {
    false: Number,
    true: Number
  },
  characteristics: { {}, {}, {} }
});