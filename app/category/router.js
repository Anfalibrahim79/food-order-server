const router = require('express').Router();
const { police_check } = require('../../middlewares');
const categoryController = require('./controller');

router.get('/', categoryController.index);
router.post('/',
  police_check('create', 'Category'),
  categoryController.store
);
router.put('/:id',
  police_check('update', 'Category'),
  categoryController.update
);
router.delete('/:id',
  police_check('delete', 'Category'),
  categoryController.destroy
);

module.exports = router;