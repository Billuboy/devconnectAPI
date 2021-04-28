const express = require('express');
const cors = require('cors');

const user = require('../routes/users');
const profile = require('../routes/profiles');
const post = require('../routes/posts');
const error = require('../middleware/errorMiddleware');

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/api/user/', user);
  app.use('/api/profile/', profile);
  app.use('/api/post/', post);
  app.use(error);
};
