const express = require('express');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);
const app = express();

require('./startup/errorHandler')();
require('./startup/db')();
require('./startup/passport')();
require('./startup/routes')(app);


const port = process.env.PORT || 3001;
// don't forget to check /config/keys_dev for mongoDB uri and jwt secret key.
app.listen(port, () => console.log(`Listening on port ${port}...`));
