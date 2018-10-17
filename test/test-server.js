const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the should syntax available throughout
// this module
const should = chai.should();

const { Borrowd } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedBorrowdData() {
  console.info('seeding borrowd data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      board: faker.lorem.sentence(),
      newId: faker.random.number().toString(), 
    });
  }
  return Borrowd.insertMany(seedData);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('Borrowd API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedBorrowdData(); //within ()take in 
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {

    it('should return all existing posts', function () {
      let res;
      return chai.request(app)
        .get('/get')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);

          return Borrowd.count();
        })
        .then(count => {
         
          res.body.should.have.lengthOf(count);
        });
	});

		it('should return board with right fields', function () {
      let resBoard;
      return chai.request(app)
        .get('/get')
        .then(function (res) {

          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');

          res.body.should.have.lengthOf.at.least(1);
          res.body.forEach(function (post) {
            console.log(post.board);
            console.log(post.newId);
            post.board.should.be.a('array');
            post.should.include.keys('board', 'newId');
          });
          // just check one of the posts that its values match with those in db
          // and we'll assume it's true for rest
          resBoard = res.body[0];
          console.log(resBoard);
          //console.log(resBoard.id);
          console.log(resBoard.newId);
          return Borrowd.find(resBoard);
          
        })
    });
});

    describe('POST endpoint', function () {
    
    it('should add a new board', function () {

      const newBoard = {
      board: [ faker.lorem.sentence()],
      newId: faker.random.number() 
    };
    //console.log(newBoard);

      return chai.request(app)
        .post('/post')
        .send(newBoard)
        .then(function (res) {
          //console.log(res.body);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'board', 'newId');
          res.body.board[0].should.equal(newBoard.board[0]);
          res.body.newId.should.equal(newBoard.newId.toString());
          return Borrowd.findById(res.body.id;
        })
        .then(function (board) {
          board[0].board.should.eql(newBoard.board);
          board.newId.should.equal(newBoard.newId.toString());
        });
    });
});

describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing post from dbgit
    //  2. Make a PUT request to update that post
    //  4. Prove post in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        board:['This is a test'],
      };
      console.log(updateData);
      return chai.request(app)
          .get('/get')
          .then(function(res) {
          updateData.id = res.body[0].id;

          return chai.request(app)
            .put(`/put/${updateData.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Borrowd.findById(updateData.id);
        })
    });
});
  });