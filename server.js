const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const {DATABASE_URL, PORT} = require('./config');
const { Borrowd } = require('./models');
const { User } = require('./users/models');
const passport = require('passport');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
//const { Borrowd } = require('./models');
require('dotenv').config();
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


const jsonParser = bodyParser.json();

const app = express();
app.use(morgan('common'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/get', (req, res) => {
   Borrowd
   .find() //will need to do findOne({userid})
   .then(board => {res.json(board)})
   .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/get/:newId', (req, res) => {
   Borrowd
   .findOne({newId: req.params.newId}) //will need to do findOne({userid})
   .then(board => {res.json(board)})
   .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/api/user', (req, res) => {
   User
   .find() //will need to do findOne({userid})
   .then(user => {res.json(user)})
   .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


app.post('/post', jsonParser, (req, res) => {
  const requiredFields = ['board', 'newId'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

   Borrowd
	.create({
	board: req.body.board,
	newId: req.body.newId
	})
	.then(borrowd => res.status(200).json(borrowd.serialize()))
});

app.put('/put/:newId', jsonParser, (req, res) => {
  const updated = {};
  const updateableFields = ['board'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
 
 Borrowd
    .findOneAndUpdate({newId: req.params.newId}, { board: updated.board }, {new: true}, function(err, doc){})
    .then(updatedBoard => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);

      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };