const express = require('express');
const router = express.Router();
const fuelStationController = require('../controller/fuelPump.controller');

router.get('/fuelStations', fuelStationController.getFuelStationDetails);
router.post('/removeStation/:id',fuelStationController.removeFuelStation);

module.exports = router;
