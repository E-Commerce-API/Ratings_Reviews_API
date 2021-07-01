process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let { CombinedReviews } = require('../database');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp)
describe('Reviews', done => {
  before((done) => {
    CombinedReviews.deleteMany({}, err => {
      done();
    });
  });

  describe('/GET Reviews', () => {
    it('it should GET all the reviews for a given product id', done => {
      chai.request(server)
        .get('/reviews?product_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('results');
          res.body.results.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/GET Reviews/Meta', () => {
    it('it should GET all the meta data for the given product id', done => {
      chai.request(server)
        .get('/reviews/meta?product_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ratings');
          res.body.ratings.should.be.a('object');
          res.body.should.have.property('recommend');
          res.body.should.have.property('characteristics');
          done();
        });
    });
  });

  describe('/POST Review', () => {
    it('it should POST new review to database', done => {
      chai.request(server)
        .post('/reviews')
        .send({
          "product_id": 1,
          "rating": 5,
          "summary": "this is the summary for the newest product",
          "body": "continued text from the summary and can be soooo much longer if it wants to or needs to be",
          "recommend": false,
          "name": "cjohansen",
          "email": "ccsailor11@gmail.com",
          "photos": [
            "www.gasdf.com",
            "www.3jladsf.com"
          ],
          "characteristics": {
            "Length": 333,
            "Comfort": 111,
            "Fit": 333,
            "Quality": 222
          }
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    after(done => {
      CombinedReviews.deleteMany({}, err => {
        done();
      });
    })
  });

  describe('/POST and /GET Newly Added Review', () => {
    it('it should POST a new review...', done => {
      chai.request(server)
        .post('/reviews')
        .send({
          "product_id": 1,
          "rating": 5,
          "summary": "this is the summary for the newest product",
          "body": "continued text from the summary and can be soooo much longer if it wants to or needs to be",
          "recommend": false,
          "name": "cjohansen",
          "email": "ccsailor11@gmail.com",
          "photos": [
            "www.gasdf.com",
            "www.3jladsf.com"
          ],
          "characteristics": {
            "Length": 333,
            "Comfort": 111,
            "Fit": 333,
            "Quality": 222
          }
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
    it('should retrieve the data from the recently POSTed review', done => {
      chai.request(server)
        .get('/reviews?product_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results.should.be.a('array');
          res.body.results.length.should.be.eql(1);
          res.body.results[0].product_id.should.eql(1);
          done();
        });
    });
  });

  describe('/PUT Helpful', () => {
    it('should mark review as helpful', done => {
      chai.request(server)
        .put('/reviews/1/helpful')
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it('should increase helpful counter by 1', done => {
      chai.request(server)
        .get('/reviews?product_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results[0].helpfulness.should.eql(1);
          done();
        });
    });
  });

  describe('/PUT Report', () => {
    it('should mark review as reported', done => {
      chai.request(server)
        .put('/reviews/1/report')
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
    it('should not be able to retrieve review that was reported', done => {
      chai.request(server)
        .get('/reviews?product_id=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results.should.be.a('array');
          res.body.results.length.should.be.eql(0);
          done();
        })
    });
  });
  after(done => {
    CombinedReviews.deleteMany({}, err => {
      done();
    });
  });
});