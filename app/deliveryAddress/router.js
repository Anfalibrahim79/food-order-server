const { police_check } = require('../../middlewares');
const deliveryAddressController = require('./controller');

const router = require('express').Router();

router.post(
  '/',
  police_check('create', 'DeliveryAddress'),
  deliveryAddressController.store
);

router.put('/:id', deliveryAddressController.update);
router.delete('/:id', deliveryAddressController.destroy);

router.get(
  '/',
  police_check('view', 'DeliveryAddress'),
  deliveryAddressController.index
)

module.exports = router;