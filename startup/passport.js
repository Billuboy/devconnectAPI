const passport = require('passport');
const express = require('express');
const app = express();

module.exports = function () {
  app.use(passport.initialize());
  require('../config/passport')(passport);
};
