const router = require('express').Router();
const { police_check } = require('../../middlewares');
const tagController = require('./controller');

router.get('/',
  tagController.index
);
router.get('/:category',
  tagController.showTagByCategory
);
router.post('/',
  police_check('create', 'Tag'),
  tagController.store
);
router.put('/:id',
  police_check('update', 'Tag'),
  tagController.update
);
router.delete('/:id',
  police_check('delete', 'Tag'),
  tagController.destroy
);

module.exports = router;