const mongoose = require('mongoose');
const { Schema } = mongoose;

const pumpDetails = new Schema({
  pumpName: {
    type: String,
    required: [true, 'Name is required'],
  },
  address: {
    type: String,
  },
  dieselRate: {
    type: String,
  },
  status: {
    type: String,
    enum: ['A', 'I'],
    default: 'A'
  }
});

const Fuel_Pump_Details = mongoose.model('Fuel_Pump_Details', pumpDetails);

module.exports = Fuel_Pump_Details;
