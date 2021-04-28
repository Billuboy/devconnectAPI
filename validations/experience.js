const Joi = require('joi');

module.exports = function Validate(body, res) {
  const schema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().optional().allow(''),
    from: Joi.date().required(),
    to: Joi.date(),
    current: Joi.boolean().optional().allow(''),
    description: Joi.string().optional().allow(''),
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
