const express = require('express');
const { getTours, getTourDetail } = require('../controllers/tourController');

const router = express.Router();

router.get('/', getTours);
router.get('/:identifier', getTourDetail);

module.exports = router;
