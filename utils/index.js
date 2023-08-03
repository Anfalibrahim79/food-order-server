const cloudinary = require('cloudinary').v2;;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudName, cloudApiKey, cloudApiSecret } = require('../app/config')
const { Ability, AbilityBuilder } = require('@casl/ability');


function getToken(req) {
  let token =
    req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : null;

  return token && token.length ? token : null;
}

// policy

const policies = {
  guest(user, { can }) {
    can('read', 'Product');
  },
  user(user, { can }) {
    can('view', 'Order');
    can('create', 'Order');
    can('read', 'Order', { user_id: user._id });
    can('update', 'User', { _id: user._id });
    can('read', 'Cart', { user_id: user._id });
    can('update', 'Cart', { user_id: user._id });
    can('view', 'DeliveryAddress');
    can('create', 'DeliveryAddress', { user_id: user._id });
    can('update', 'DeliveryAddress', { user_id: user._id });
    can('delete', 'DeliveryAddress', { user_id: user._id });
    can('read', 'Invoice', { user_id: user._id });
  },
  admin(user, { can }) {
    can('manage', 'all');
  },
}

const policyFor = user => {
  let builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, builder);
  } else {
    policies['guest'](user, builder);
  }
  return new Ability(builder.rules)
}

// Cloud Configuration

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
  secure: true
})

const storageCloud = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],

  }
})



module.exports = {
  getToken,
  policyFor,
  storageCloud
}