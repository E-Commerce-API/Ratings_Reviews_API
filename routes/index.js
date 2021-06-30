const { Reviews, Photos, Characteristics, CharacteristicReviews, CombinedReviews } = require(__dirname + '/../database/index.js');
const url = require('url');

/*
 * GET ALL REVIEWS
 */
const getReviews = async (req, res) => {
  let id = Number(req.query.product_id);
  let page = Number(req.query.page) || 0;
  let count = Number(req.query.count) || 5;
  let response = {
    product: id,
    page: page,
    count: count,
    results: []
  }

  let query = await CombinedReviews.find({ product_id: id }, { characteristics: 0 })
    .skip(page * count)
    .limit(count)

  if (!query.length) {
    res.json(response).end();
  } else {
    response.results.push(...query)
    res.json(response).end();
  }
}

/*
 * GET META DATA
 */
const getMeta = async (req, res) => {
  let id = Number(req.query.product_id);
  let response = {
    product_id: id,
    ratings: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    },
    recommend: {},
    characteristics: {}
  }

  let reviewsQuery = await CombinedReviews.find({ product_id: id }, { photos: 0 });

  let characteristics;
  let values = [];

  if (reviewsQuery.length) {
    reviewsQuery.forEach((review, i) => {
      response.ratings[review.rating] = response.ratings[review.rating] + review.rating || review.rating;
      response.recommend[review.recommend] = response.recommend[review.recommend] + 1 || 1;

      characteristics = review.characteristics;

      console.log(review)
      characteristics.forEach(characteristic => {
        i === 0 ? values.push({ name: characteristic.name, score: characteristic.value }) : null;

        response.characteristics[characteristic.name] = 0
      })
    })
  }

  if (values.length) {
    values.forEach(({ name, score }) => {
      console.log(score)
      score.forEach(({ value }, i) => {
        // console.log('i', i, 'length', score.length, 'value', value)
        response.characteristics[name] = i === score.length - 1 ? (response.characteristics[name] + value) / score.length : response.characteristics[name] + value || value
      })
    })
  }

  res.json(response)
}

// const addCharacteristic = async (_productId, _key, _value, _reviewId) => {

//   let characteristicCount = await Characteristics.find({}).sort({ id: -1 }).limit(1);
//   let characteristicReviewCount = await CharacteristicReviews.find({}).sort({ id: -1 }).limit(1);

//   let newCharacteristic = new Characteristics({
//     id: (characteristicCount[0].id + 1),
//     product_id: _productId,
//     name: _key
//   });

//   let saved = await newCharacteristic.save();

//   let newCharacteristicReview = new CharacteristicReviews({
//     id: (characteristicReviewCount[0].id + 1),
//     characteristic_id: newCharacteristic.id,
//     review_id: _reviewId,
//     value: _value
//   })

//   let savedCharacteristicReview = await newCharacteristicReview.save();

// }

// const addPhoto = async (_reviewId, _url) => {
//   let count = await Photos.find({}).sort({ id: -1 }).limit(1);

//   let newPhoto = new Photos({
//     id: (count[0].id + 1),
//     review_id: _reviewId,
//     url: _url
//   })

//   let savedPhoto = await newPhoto.save();
// }


const addReview = async (req, res) => {

  let count = await CombinedReviews.find({}).sort({ id: -1 }).limit(1);

  let newCharacteristics = []
  let newPhotos = []

  req.body.photos.forEach(photo => {
    newPhotos.push({
      review_id: count[0].id + 1,
      url: photo
    })
  })

  for (let key in req.body.characteristics) {

    newCharacteristics.push({
      product_id: req.body.product_id,
      name: key,
      value: {
        review_id: count[0].id + 1,
        value: req.body.characteristics[key]
      }
    })
  }

  // let newReview = {
  //   id: count[0].id + 1,
  //   product_id: req.body.product_id,
  //   rating: req.body.rating,
  //   date: new Date().toISOString(),
  //   summary: req.body.summary,
  //   body: req.body.body,
  //   recommend: req.body.recommend,
  //   reported: false,
  //   reviewer_name: req.body.name,
  //   reviewer_email: req.body.email,
  //   response: '',
  //   helpfulness: 0,
  //   photos: newPhotos,
  //   characteristics: newCharacteristics
  // }

  // console.log(newReview)

  let newReview = new CombinedReviews({
    _id: count[0].id + 1,
    id: count[0].id + 1,
    product_id: req.body.product_id,
    rating: req.body.rating,
    date: new Date().toISOString(),
    summary: req.body.summary,
    body: req.body.body,
    recommend: req.body.recommend,
    reported: false,
    reviewer_name: req.body.name,
    reviewer_email: req.body.email,
    response: '',
    helpfulness: 0,
    photos: newPhotos,
    characteristics: newCharacteristics
  })

  let saved = await newReview.save();
  console.log(saved)
  // let newPhotos = []

  // req.body.photos.forEach(photo => {
  //   newPhotos.push({ url: photo })
  // })

  // let review = new Reviews({
  //   id: (count[0].id + 1),
  //   product_id: req.body.product_id,
  //   rating: req.body.rating,
  //   summary: req.body.summary,
  //   body: req.body.body,
  //   recommend: req.body.recommend,
  //   name: req.body.name,
  //   email: req.body.email,
  //   reported: false,
  //   helpfulness: 0,
  //   photos: [...newPhotos]
  // });

  // let savedReview = await review.save();

  // let makePhoto = req.body.photos;


  // makePhoto.forEach(async photo => {
  //   await addPhoto(review.id, photo);
  // });

  // let makeCharacteristic = req.body.characteristics;
  // let index = 0;

  // for (let key in makeCharacteristic) {
  //   await addCharacteristic(req.body.product_id, key, makeCharacteristic[key], review.id)
  // }

  res.sendStatus(201);
}

const updateHelpfulness = async (req, res) => {

  let review_id = req.url.slice(9, -8);

  let filter = { _id: review_id };
  let update = { $inc: { helpfulness: +1 } };
  let fetchedReview = await CombinedReviews.findOneAndUpdate(filter, update);

  res.sendStatus(204);

}

const updateReported = async (req, res) => {

  let review_id = req.url.slice(9, -7);

  let filter = { _id: review_id };
  let update = { reported: true };
  let fetchedReview = await CombinedReviews.findOneAndUpdate(filter, update);

  res.sendStatus(204);

}

module.exports = {
  getReviews,
  getMeta,
  addReview,
  updateHelpfulness,
  updateReported
}