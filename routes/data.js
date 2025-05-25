const express = require('express');
const router = express.Router();

const dataController = require('../controllers/data');

router.get('/', dataController.getAll);

router.get('/:id', dataController.getSingle);

router.post('/', dataController.addData);

router.put('/:id', dataController.editData);

router.delete('/:id', dataController.removeData);

module.exports = router;