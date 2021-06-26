const { Reviews, Photos, Characteristics, CharacteristicReviews } = require(__dirname + '/../database/index.js');
const url = require('url');

const getReviews = async (req, res) => {
  let id = req.query.product_id;
  let page = Number(req.query.page) || 0;
  let count = Number(req.query.count) || 5;
  let response = {
    product: id,
    page: page,
    count: count,
    results: []
  }

  let query = await Reviews.find({ product_id: id }, { characteristics: 0 })
    .and({ reported: false })
    .skip(page * count)
    .limit(count)

  if (!query.length) {
    res.json(response).end();
  } else {
    response.results.push(...query)
    res.json(response).end();
  }

}


const getMeta = async (req, res) => {
  let id = req.query.product_id;
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

  let characteristicsQuery = await Characteristics.find({ product_id: id })
  let reviewsQuery = await Reviews.find({ product_id: id })

  if (reviewsQuery.length) {
    reviewsQuery.forEach(review => {
      response.ratings[review.rating] = response.ratings[review.rating] + review.rating || review.rating;
      response.recommend[review.recommend] = response.recommend[review.recommend] + 1 || 1;
    })
  }

  let index = 0;

  let checkScores = async () => {
    return new Promise((resolve, reject) => {
      if (characteristicsQuery.length) {
        characteristicsQuery.forEach(async characteristic => {
          response.characteristics[characteristic.name] = {
            value: 0
          }

          let scores = await CharacteristicReviews.find({ characteristic_id: characteristic['_id'] });
          if (scores.length) {

            let value = 0;
            let numOfValues = 0;
            let totalValue = 0;
            for (let i = 0; i < scores.length; i++) {
              numOfValues++;
              totalValue += scores[i].value;
              response.characteristics[characteristic.name].value = totalValue / numOfValues;
            }
          }
          index === characteristicsQuery.length - 1 ? resolve() : index++;
        })
      }
    })
  };

  (async () => {
    await checkScores();
    res.json(response)
  })()

}

const addCharacteristic = async (_productId, _key, _value, _reviewId) => {

  let newCharacteristic = new Characteristics({
    product_id: _productId,
    name: _key
  });

  let saved = await newCharacteristic.save();

  let newCharacteristicReview = new CharacteristicReviews({
    characteristic_id: newCharacteristic['_id'],
    review_id: _reviewId,
    value: _value
  })

  let savedCharacteristicReview = await newCharacteristicReview.save();
}

const addPhoto = async (_reviewId, _url) => {
  let newPhoto = new Photos({
    review_id: _reviewId,
    url: _url
  })

  let savedPhoto = await newPhoto.save();
}

const aggregation = async (_id) => {
  console.log(_id)
  let agg = await Reviews.aggregate([
    {
      "$match": {
        "_id": _id
      }
    },
    {
      "$lookup": {
        "from": "photos",
        "localField": "_id",
        "foreignField": "review_id",
        "as": "photos"
      }
    },
    {
      "$out": "reviews"
    }
  ])
  let test = await Photos.find({review_id: _id})
  console.log(testCharacteristic)
}

const addReview = async (req, res) => {

  let review = new Reviews({
    product_id: req.body.product_id,
    rating: req.body.rating,
    summary: req.body.summary,
    body: req.body.body,
    recommend: req.body.recommend,
    name: req.body.name,
    email: req.body.email,
    reported: false,
    helpfulness: 0,
    // photos: [...req.body.photos]
  });

  let savedReview = await review.save();

  let makePhoto = req.body.photos;
  makePhoto.forEach(photo => {
    addPhoto(review['_id'], photo);
  });

  let makeCharacteristic = req.body.characteristics;
  for (let key in makeCharacteristic) {
    addCharacteristic(req.body.product_id, key, makeCharacteristic[key], review['_id'])
  }

  aggregation(review['_id']);

  res.sendStatus(201);
}

const updateHelpfulness = async (req, res) => {

  let review_id = req.url.slice(9, -8);

  let filter = { _id: review_id };
  let update = { $inc: { helpfulness: +1 } };
  let fetchedReview = await Reviews.findOneAndUpdate(filter, update);

  res.sendStatus(204);

}

const updateReported = async (req, res) => {

  let review_id = req.url.slice(9, -7);

  let filter = { _id: review_id };
  let update = { reported: true };
  let fetchedReview = await Reviews.findOneAndUpdate(filter, update);

  res.sendStatus(204);

}

module.exports = {
  getReviews,
  getMeta,
  addReview,
  updateHelpfulness,
  updateReported
}