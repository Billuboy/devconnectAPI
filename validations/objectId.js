const Joi = require('joi');

module.exports = function (body, res) {
  const result = Joi.objectId().validate(body);

  if (result.error) {
    res.status(400).json({ objectId: 'Invalid objectId' });
    return;
  }

  return 0;
};
