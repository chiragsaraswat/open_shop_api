const jwt = require('jsonwebtoken');
const Businesses = require('../models/businesses');
const keys = require('../../config/keys')

const bus_auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, keys.jwtSecret);
    const businesses = await Businesses.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!businesses) {
      throw new Error();
    }
    req.token = token;
    req.businesses = businesses;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate Business' });
  }
};

module.exports = bus_auth;
