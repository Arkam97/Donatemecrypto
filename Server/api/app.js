const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const HttpError = require('./service/http-error');
const mainroutes = require("./routes/mainroutes.js")
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api', mainroutes);
// app.get('/', (req, res) => res.send('Hello World!'))

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});


mongoose
  .connect(
    'mongodb+srv://arkam:A777467304b@cluster-arkam-bav5m.mongodb.net/Donateme?retryWrites=true&w=majority',
  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() => {
    app.listen(5000);
    console.log(`Donatemecrypto Connected to database on port ${port}`);
  })
  .catch(err => {
    console.log(err);
  });