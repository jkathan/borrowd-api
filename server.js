const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const {DATABASE_URL, PORT} = require('./config');
const { Borrowd } = require('./models');
const passport = require('passport');
const bodyParser = require('body-parser');
//const { Borrowd } = require('./models');
const app = express();
const jsonParser = bodyParser.json();
app.use(
    cors({})
);

app.get('/get', (req, res) => {
   Borrowd
   .find() //will need to do findOne({userid})
   .then(board => {res.json(board)})
   .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.post('/post', (req, res) => {
  const requiredFields = ['board'];
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
	board: req.body.board
	})
	.then(board => res.status(200).json(borrowd.serialize()))
});
//put/:userId
app.put('/put', (req, res) => {
  const updated = {};
  const updateableFields = ['board'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
 
 Borrowd
    .findByIdAndUpdate(req.params.userId, { $set: updated }, { new: true })
    .then(updatedBook => res.status(204).end())
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