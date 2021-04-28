const Joi = require('joi');

module.exports = function (body, res) {
  const schema = Joi.object({
    name: Joi.string(),
    text: Joi.string().required(),
  });

  const result = schema.validate(body, { abortEarly: false });

  let error = {};

  if (result.error) {
    result.error.details.forEach(err => {
      let path = err.path[0];
      error[path] = err.message;
    });
    res.status(400).json(error);
    return;
  }

  return 0;
};
