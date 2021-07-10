const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const addressSchema = new mongoose.Schema({
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  shop_no: {
    type: String,
  },
});

const BusinessesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobiles: [
    {
      mobile: {
        type: Number,
        required: true,
      },
    },
  ],
  address: addressSchema,
  owner_name: {
    type: String,
    required: true,
  },
  bussiness_avatar: {
    type: Buffer,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

BusinessesSchema.methods.toJSON = function () {
  const business = this;
  const businessObject = business.toObject();

  delete businessObject.password;
  delete businessObject.tokens;
  delete businessObject.avatar;

  return businessObject;
};

BusinessesSchema.methods.genAuthToken = async function () {
  const business = this;
  const token = jwt.sign(
    { _id: business._id.toString() },
    keys.jwtSecret
  );
  business.tokens = business.tokens.concat({ token });
  await business.save();
  return token;
};

BusinessesSchema.statics.findByCredentials = async (email, password) => {
  const business = await Businesses.findOne({ email });
  if (!business) {
    throw new Error('unable to login');
  }
  const isMatch = await bcrypt.compare(password, business.password);

  if (!isMatch) {
    throw new Error('unable to login');
  }

  return business;
};
BusinessesSchema.pre('save', async function (next) {
  const business = this;
  if (business.isModified('password')) {
    business.password = await bcrypt.hash(business.password, 8);
  }
  next();
});

const Businesses = mongoose.model('Businesses', BusinessesSchema);
module.exports = Businesses;
