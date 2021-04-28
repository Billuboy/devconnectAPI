const passport = require('passport');

module.exports = async function (req, res, next) {
  await passport.authenticate('jwt', { session: false });

  if (!req.user) return res.status(401).json({ error: 'Unauthorised' });

  next();
};
