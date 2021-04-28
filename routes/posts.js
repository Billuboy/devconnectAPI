const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passport = require('passport');

const Validate = require('../validations/post');
const validateObjectId = require('../validations/objectId');
const Post = require('../models/post');
const { reset } = require('nodemon');

// @route   GET api/post
// @desc    Get posts
// @access  Public
router.get('/', async (req, res) => {
  const response = await Post.find().sort({ date: -1 });

  if (response.length === 0)
    return res.status(404).json({ noPost: 'No posts available' });

  return res.json(response);
});

// @route   GET api/post/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', async (req, res) => {
  const result = validateObjectId(req.params.id, res);
  if (result === undefined) return;

  const response = await Post.findById(req.params.id);

  if (!response)
    return res.status(404).json({ post: 'No post found with given ID' });

  return res.json(response);
});

// @route   POST api/post
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = Validate(req.body, res);
    if (result === undefined) return;

    const post = _.pick(req.body, ['text']);
    post.user = req.user._id;
    post.name = req.user.name;

    const newPost = new Post(post);

    const response = await newPost.save();
    return res.json(response);
  }
);

// @route   DELETE api/post/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = validateObjectId(req.params.id, res);
    if (result === undefined) return;

    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ post: 'No post found with given id' });

    if (String(post.user) !== req.user.id)
      return res.status(401).json({ error: 'Unauthorized user' });

    await post.remove();

    return res.json({ deleted: true });
  }
);

// @route   POST api/post/like/:id
// @desc    Like and Unlike post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const result = validateObjectId(req.params.id, res);
    if (result === undefined) return;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'No post found' });

    if (
      post.likes.filter(like => String(like.user) === req.user.id).length > 0
    ) {
      const removeIndex = post.likes
        .map(like => like.user)
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
      const response = await post.save();

      return res.json(response);
    }

    const response = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          likes: { user: req.user.id },
        },
      },
      { new: true }
    );

    return res.json(response);
  }
);

// @route   POST api/post/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let result = validateObjectId(req.params.user_id, res);
    if (result === undefined) return;

    result = Validate(req.body, res);
    if (result === undefined) return;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ post: 'No post found' });

    const comment = _.pick(req.body, ['name', 'text']);
    comment.user = req.user._id;
    comment.name = req.user.name;

    post.comments.unshift(comment);

    const response = await post.save();
    return res.json(response);
  }
);

// @route   DELETE api/post/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let result = validateObjectId(req.params.id, res);
    if (result === undefined) return;

    result = validateObjectId(req.params.comment_id, res);
    if (result === undefined) return;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ post: 'No post found' });

    if (String(post.user) !== req.user.id)
      return res.status(401).json({ error: 'Unauthorized user' });

    if (
      post.comments.filter(
        comment => String(comment._id) === req.params.comment_id
      ).length === 0
    ) {
      return res.status(404).json({ error: 'Comment does not exist' });
    }

    const removeIndex = post.comments
      .map(comment => comment._id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    const response = await post.save();
    return res.json(response);
  }
);

module.exports = router;
