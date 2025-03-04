const cardController = require('../Controllers/cardController');
const express = require('express');
const router = express.Router();
const auth = require("../Middlewares/auth");

router.post('/create',  cardController.create);

module.exports = router;