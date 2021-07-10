const mongoose = require('mongoose');
const config = require('config');
const keys = require('../../config/keys')
const mongooseURL = keys.mongoURI

mongoose.connect(mongooseURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
