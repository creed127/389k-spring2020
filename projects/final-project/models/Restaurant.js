var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var hoursSchema = new mongoose.Schema({
   open:{
     type: String,
     required: true
   },
   close:{
     type: String,
     required: true
   }
});


var restaurantSchema = new mongoose.Schema({
         name:{
           type: String,
           required: true
         },
         hours:{
           type: hoursSchema,
           required: true
         },
         time:{
           type: Number,
           required: true
         },
         menu:{
           type: [String],
           required: true
         },
         platforms:{
           type: [String],
           required: true
         }
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;

// "name": "Maiwand Kabob",
// "open": "10:00 AM",
// "close": "9:00 PM",
// "time": 22,
// "menu": ["butter chicken", "basmati rice", "lamb", "chickpeas", "samosas"],
// "platforms": ["Postmates", "GrubHub"]
