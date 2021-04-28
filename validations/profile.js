const Joi = require('joi');

module.exports = function Validate(body, res) {
  const schema = Joi.object({
    user: Joi.objectId(),
    handle: Joi.string().required(),
    company: Joi.string().optional().allow(''),
    website: Joi.string().uri().optional().allow(''),
    location: Joi.string().optional().allow(''),
    status: Joi.string().required(),
    skills: Joi.string().optional().allow(''),
    bio: Joi.string().optional().allow(''),
    githubusername: Joi.string().optional().allow(''),
    social: Joi.object({
      youtube: Joi.string().optional().allow(''),
      twitter: Joi.string().optional().allow(''),
      linkedin: Joi.string().optional().allow(''),
      instagram: Joi.string().optional().allow(''),
      facebook: Joi.string().optional().allow(''),
    }),
  });

  const result = schema.validate(body, { abortEarly: false });

  let error = {};

  if (result.error) {
    result.error.details.forEach(err => {
      let path;
      if (err.path[0] === 'social') {
        path = err.path[1];
      } else {
        path = err.path[0];
      }
      error[path] = err.message;
    });
    res.status(400).json(error);
    return;
  }

  return 0;
};
