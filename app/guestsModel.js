const mongoose = require('mongoose');

var guestSchema = new mongoose.Schema({
     name:  String,
     family: Boolean,
     bridal_party: Boolean,
     notDrinking: Boolean,
     plusOne: Boolean
   }, {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Guests', guestSchema, 'Guests');
