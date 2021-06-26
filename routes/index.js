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

  ( async () => {
    await checkScores();
    res.json(response)
  })()

}

const addPhotos = async (_id, _photo) => {

  const newPhoto = new Photos({
    url: _photo
  })

  let addPhoto = await newPhoto;
  let savedPhoto = await newPhoto.save();
  let findReview = await Reviews.find({ _id: _id });
  findReview[0].photos.push(savedPhoto);
  let response = await findReview[0].save();

}

const addCharacteristics = async (_id, _key, _value) => {

  const newCharacteristic = new Characteristics({
    name: _key,
    value: _value
  });

  let addCharacteristic = await newCharacteristic;
  let savedCharacteristic = await addCharacteristic.save();
  let findReview = await Reviews.find({ _id: _id });
  findReview[0].characteristics.push(savedCharacteristic);
  let response = await findReview[0].save();
}

const addReview = async (req, res) => {
  let addNewReview;

  let review = new Reviews({
    product_id: req.body.product_id,
    rating: req.body.rating,
    summary: req.body.summary,
    body: req.body.body,
    recommend: req.body.recommend,
    name: req.body.name,
    email: req.body.email,
    reported: false,
    helpfulness: 0
  });

  try {
    let newReview = await review;
    addNewReview = await newReview.save();
  } catch (err) {
    console.log(err.message)
  } finally {
    req.body.photos.forEach(photo => {
      addPhotos(addNewReview._id, photo)
    })
    for (let key in req.body.characteristics) {
      addCharacteristics(addNewReview._id, key, req.body.characteristics[key]);
    }
    res.sendStatus(201)
  }
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
  console.log(review_id)
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