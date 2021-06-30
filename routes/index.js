const { Reviews, Photos, Characteristics, CharacteristicReviews, CombinedReviews } = require(__dirname + '/../database/index.js');
const url = require('url');

/*
 * GET ALL REVIEWS
 */
const getReviews = async (req, res) => {
  let sort;
  let id = Number(req.query.product_id);
  let page = Number(req.query.page) || 0;
  let count = Number(req.query.count) || 5;
  let response = {
    product: id,
    page: page,
    count: count,
    results: []
  }

  req.query.sort === 'helpful' ? sort = { helpfulness: -1 } : req.query.sort === 'newest' ? sort = { date: -1 } : req.query.sort === 'relevant' ? sort = { helpfulness: -1, date: -1 } : null;

  let query = await CombinedReviews.find({ product_id: id, reported: { $ne: true } }, { characteristics: 0 })
    .skip(page * count)
    .limit(count)
    .sort(sort)

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
  let values = {};

  if (reviewsQuery.length) {
    reviewsQuery.forEach((review, i) => {
      response.ratings[review.rating] = response.ratings[review.rating] + review.rating || review.rating;
      response.recommend[review.recommend] = response.recommend[review.recommend] + 1 || 1;

      characteristics = review.characteristics;

      characteristics.forEach(characteristic => {
        if (!values[characteristic.name.name]) {
          values[characteristic.name.name] = {
            scores: [characteristic.value]
          }
        } else {
          values[characteristic.name.name].scores.push(characteristic.value)
        }

        response.characteristics[characteristic.name.name] = 0
      })
    })
  }

  for (let key in values) {
    response[key] = values[key].scores.reduce(function (avg, value, _, { length }) {
      return avg + value / length;
    }, 0);
  }

  res.json(response)
}

/*
 * POST ROUTE TO ADD REVIEW
 */
const addReview = async (req, res) => {

  let count = await CombinedReviews.find({}).sort({ _id: -1 }).limit(1);
  !count.length ? count = [ { id: 0 } ] : null;

  let newCharacteristics = []
  let newPhotos = []

  req.body.photos.forEach(photo => {
    newPhotos.push({
      review_id: count[0].id + 1 || 1,
      url: photo
    })
  })

  for (let key in req.body.characteristics) {

    newCharacteristics.push({
      review_id: req.body.product_id,
      name: {
        product_id: req.body.product_id,
        name: key
      },
      value: req.body.characteristics[key]
    })
  }

  let newReview = new CombinedReviews({
    _id: count[0].id + 1 || 1,
    id: count[0].id + 1 || 1,
    product_id: req.body.product_id,
    rating: req.body.rating,
    date: new Date().getTime(),
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

  res.sendStatus(201);
}

/*
 * PUT ROUTE FOR HELPFULNESS
 */
const updateHelpfulness = async (req, res) => {

  let review_id = req.url.slice(9, -8);

  let filter = { _id: review_id };
  let update = { $inc: { helpfulness: +1 } };
  let fetchedReview = await CombinedReviews.findOneAndUpdate(filter, update);

  res.sendStatus(204);

}

/*
 * PUT ROUTE FOR REPORTED
 */
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