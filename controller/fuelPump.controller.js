const FuelPumpDetails = require('../model/fuelStation.model');
const express = require('express');

exports.getFuelStationDetails = async (req, res) => {
    try {
        const fuelStations = await FuelPumpDetails.find();
        res.status(200).json(fuelStations);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching fuel station details' });
    }
};

exports.removeFuelStation = async(req,res) => {
    const id = req.params.id;
    try {
        const fuelPump = await FuelPumpDetails.findOne(id);
        fuelPump.status = 'I';
        await fuelPump.save();
        res.status(200).send('Removed');
    } catch (error) {
        res.status(500).send('Not able to remove')
    }
};