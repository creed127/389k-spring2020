var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var restaurantUtil = require("./restaurant-util");
var _ = require("underscore");
var dotenv = require('dotenv');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Restaurant = require('./models/Restaurant');

dotenv.config();
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function(){
  console.log('MongoDB Connection Error. Please make sure that MongoDB is runnning.');
  process.exit(1);
});
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */


app.get('/',function(req, res){
  Restaurant.find({}, function(err, restaurants) {
      if(err) throw err;
      res.render('home',
       {
         data: restaurants
      });
  });
});

app.get('/addRestaurant', function(req,res){
  res.render('addData');
});

app.post('/api/addRestaurant', function(req,res){
  var body = req.body;
  var newRest = new Restaurant({
    name: body.name,
    hours: {
      open: restaurantUtil.formatAMPM(body.open),
      close: restaurantUtil.formatAMPM(body.close)
    },
    time: parseInt(body.time),
    menu: body.menu.trim().replace(" ","").split(","),
    platforms: body.platforms.trim().replace(" ", "").split(",")
  });

  newRest.save(function(err){
    if(err) throw err;
    return res.send('Succesfully added restaurant');
  });

});

app.get('/addMenuItems', function(req,res){
  res.render('editMenu');
});

app.post('/api/addMenuItems', function(req,res){
  var body = req.body;
  var items = body.items;
  Restaurant.findOne({name: body.name}, function(err,restaurant){
    if(restaurant){
      restaurant.menu.push(items);
      restaurant.save(function(err){
          if(err) throw err;
          return res.send('Succesfully added new menu items');
        });
    }
    else{
      res.send("No restaurant with that name found!");
    }
  });
});

app.get('/addPlatforms', function(req,res){
  res.render('editPlatforms');
});

app.post('/api/addPlatforms', function(req,res){
  var body = req.body;
  var items = body.items;
  Restaurant.findOne({name: body.name}, function(err,restaurant){
    if(restaurant){
      restaurant.platforms.push(items);
      restaurant.save(function(err){
          if(err) throw err;
          return res.send('Succesfully added new menu items');
        });
    }
    else{
      res.send("No restaurant with that name found!");
    }
  });
});

app.delete('/deleteRestaurant/:id', function(req,res){
  Restaurant.findByIdAndRemove(req.params.id, function(err, restaurant){
    if (err) throw err;
    if(!restaurant) return res.send('No restaurant with that id');
    res.send('Restaurant deleted!');
  });
});

app.get('/remove', function(req,res){
  res.render('removeRestaurant');
});

app.delete('/api/remove', function(req,res){
  var body = req.body
  Restaurant.findOne({name: body.name}, function(err, restaurant){
    if (err) throw err;
    if(!restaurant) return res.send('No restaurant with that name');
    res.send('Restaurant deleted!');
  });
});

app.get('/grubhub', function(req, res) {
  Restaurant.find({ platforms : {$in: [" GrubHub", "GrubHub"]} }, function(err, restaurants) {
      if(err) throw err;
      if(!restaurants) return res.send('No restaurants close at midnight');
      res.render('grubhub',
       {
         data: restaurants
      });
  });
});

app.get('/pizza', function(req, res) {
  Restaurant.find({ menu: {$in: [" pizza", "pizza", "Pizza", " Pizza"]} }, function(err, restaurants) {
      if(err) throw err;
      if(!restaurants) return res.send('No restaurants with pizza');
      res.render('pizza',
       {
         data: restaurants
      });
  });
});


app.get('/20mins', function(req, res) {
  Restaurant.find({ time: 20 }, function(err, restaurants) {
      if(err) throw err;
      if(!restaurants) return res.send('No restaurants that deliver in 20 minutes');
      res.render('20mins',
       {
         data: restaurants
      });
  });
});



app.get('/about', function(req,res){
  res.render('about');
});

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
