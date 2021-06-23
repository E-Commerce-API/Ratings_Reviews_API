const { Reviews, Photos, Characteristics } = require(__dirname + '/../database/index.js');
const url = require('url');


const getReviews = async (req, res) => {
  let id = req.query.product_id;
  let page = req.query.page || 0;
  let count = req.query.count || 5;

  let response = {
    product: id,
    page: page,
    count: count,
    results: []
  }

  let query = await Reviews.find({ product_id: id }).and({ reported: false }).limit(count)

  if (!query.length) {
    res.sendStatus(404).end();
  } else {
    response.results.push(...query)
    res.json(response).end();
  }
}

const getMeta = async (req, res) => {
  let id = req.query.product_id;
   let response = {
    product_id: id,
    ratings: {},
    recommend: {},
    characteristics: {}
   }

   let query = await Reviews.find({ product_id: id })

   if (!query.length) {
     res.sendStatus(404).end();
   } else {
    query.forEach(review => {
      response.ratings[review.rating] = response.ratings[review.rating] + review.rating || review.rating;
      response.recommend[review.recommend] = response.recommend[review.recommend] + 1 || 1;

      if (review.characteristics.length) {

        review.characteristics.forEach(characteristic => {
          response.characteristics[characteristic.name] = {
            id: characteristic.characteristic_id,
            value: characteristic.value
          }
        })
      }
    })
    res.json(response);
  }
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