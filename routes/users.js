const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');
const Validate = require('../validations/user');

// @route   GET api/user/users
// @desc    Get current logged-in user
// @access  Private
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json(req.user);
  }
);

// @route   POST api/user/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const result = Validate(req.body, res);
  if (result === undefined) return;

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({ email: 'User with current email is already registered' });

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const response = await user.save();
  return res.json(_.pick(response, ['_id', 'name', 'email']));
});

// @route   POST api/user/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .json({ email: "User with given email doesn't exist" });

  const passwordValid = await bcrypt.compare(req.body.password, user.password);

  if (!passwordValid)
    return res.status(404).json({ password: 'Password incorrect' });

  const token = user.getToken(req.body.rememberMe);

  return res.json({ token: `Bearer ${token}` });
});

module.exports = router;
