const express = require('express');
const router = new express.Router();
const Businesses = require('../models/businesses');

router.post('/bus_signup', async (req, res) => {
  const { name, mobiles, address, owner_name, email, password } = req.body;

  if (!name || !mobiles || !address || !owner_name || !email || !password) {
    return res
      .status(422)
      .send({
        error:
          'You must provide a name,mobile,address,owner_name,email&password',
      });
  }
  const businesses = new Businesses(req.body);
  try {
    await businesses.save();
    const token = await businesses.genAuthToken();
    console.log('token:' + token);
    res.status(201).send({ businesses, token });
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post('/bus_signin', async (req, res) => {
  try {
    const businesses = await Businesses.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await businesses.genAuthToken();
    res.send({ businesses, token });
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
