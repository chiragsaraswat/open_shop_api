const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please Upload a Image of Type Png'));
    }
    cb(undefined, true);
  },
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
router.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.genAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post('/signin', async (req, res) => {
  console.log(req.body.email,req.body.password);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e)
    res.status(400).send();
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['street', 'house_no', 'state_r', 'city'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = req.user;
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await user.save();
    const token = await user.genAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
