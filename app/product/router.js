const router = require('express').Router();
const multer = require('multer');
const os = require('os');
const { storageCloud } = require('../../utils')
const { police_check } = require('../../middlewares');

const productController = require('./controller');
const upload = multer({ storage: storageCloud })

router.get('/',
  productController.index
);
router.post('/',
  upload.single('image'),
  police_check('create', 'Product'),
  productController.store
);
router.put('/:id',
  upload.single('image'),
  police_check('update', 'Product'),
  productController.update
);
router.delete('/:id',
  police_check('delete', 'Product'),
  productController.destroy
);

module.exports = router;