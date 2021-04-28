module.exports = function (err, req, res, next) {
  res.status(500).json({ error: 'Some internal server error occured' });
};
