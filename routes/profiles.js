const express = require('express');
const _ = require('lodash');
const passport = require('passport');

const router = express.Router();

const Profile = require('../models/profile');
const eduValidate = require('../validations/education');
const expValidate = require('../validations/experience');
const Validate = require('../validations/profile');
const validateObjectId = require('../validations/objectId');

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const response = await Profile.findOne({
      user: req.user._id,
    }).populate('user', ['name']);

    if (!response)
      return res
        .status(404)
        .json({ newProfile: 'There is no profile for this user' });

    return res.json(response);
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', async (req, res) => {
  const response = await Profile.find().populate('user', ['name']);

  if (response.length === 0)
    return res.status(404).json({ noProfile: 'There are no profiles' });

  return res.json(response);
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', async (req, res) => {
  const response = await Profile.findOne({
    handle: req.params.handle,
  }).populate('user', ['name']);

  if (!response)
    return res
      .status(404)
      .json({ noProfile: 'There is no profile for this user' });

  return res.json(response);
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', async (req, res) => {
  const result = validateObjectId(req.params.user_id, res);
  if (result === undefined) return;

  const response = await Profile.findOne({
    user: req.params.user_id,
  }).populate('user', ['name']);

  if (!response)
    return res
      .status(404)
      .json({ newProfile: 'There is no profile for this user' });

  return res.json(response);
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = Validate(req.body, res);
    if (result === undefined) return;

    const profileFields = _.pick(req.body, [
      'handle',
      'company',
      'website',
      'location',
      'bio',
      'status',
      'githubusername',
    ]);
    profileFields.user = req.user.id;

    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = _.pick(req.body.social, [
      'youtube',
      'twitter',
      'facebook',
      'linkedin',
      'instagram',
    ]);

    const profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      if (profile.handle !== profileFields.handle) {
        const handleCheck = await Profile.findOne({
          handle: profileFields.handle,
        });

        if (handleCheck)
          return res.status(400).json({ handle: 'Handle already exists' });
      }

      const response = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(response);
    } else {
      const profile = new Profile(profileFields);

      const handleCheck = await Profile.findOne({
        handle: profile.handle,
      });

      if (handleCheck)
        return res.status(400).json({ handle: 'Handle already exists' });

      const response = await profile.save();
      return res.json(response);
    }
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = expValidate(req.body, res);
    if (result === undefined) return;

    const experience = _.pick(req.body, [
      'title',
      'company',
      'location',
      'from',
      'to',
      'current',
      'description',
    ]);
    if (experience.current) {
      experience.to = null;
    }

    const response = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          experience,
        },
      },
      { new: true }
    );

    return res.json(response);
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = eduValidate(req.body, res);
    if (result === undefined) return;

    const education = _.pick(req.body, [
      'school',
      'degree',
      'fieldofstudy',
      'from',
      'to',
      'current',
      'description',
    ]);
    if (education.current) {
      education.to = null;
    }
    const response = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          education,
        },
      },
      { new: true }
    );

    return res.json(response);
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = validateObjectId(req.params.exp_id, res);
    if (result === undefined) return;

    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const index = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (index < 0)
      return res
        .status(404)
        .json({ error: "Experience data with given ID doesn't exist" });

    profile.experience.splice(index, 1);

    const response = await profile.save();
    return res.json(response);
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = validateObjectId(req.params.edu_id, res);
    if (result === undefined) return;

    const profile = await Profile.findOne({ user: req.user.id });

    const index = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (index < 0)
      return res
        .status(404)
        .json({ error: "Education data with given ID doesn't exist" });

    profile.education.splice(index, 1);

    const response = await profile.save();
    return res.json(response);
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Profile.findOneAndRemove({ user: req.user.id });

    return res.json({ deleted: true });
  }
);

module.exports = router;
