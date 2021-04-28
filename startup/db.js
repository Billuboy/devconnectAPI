const mongoose = require('mongoose');
const { dbURI } = require('../config/keys');

module.exports = function () {
  mongoose
    .connect(dbURI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB...'));
};
