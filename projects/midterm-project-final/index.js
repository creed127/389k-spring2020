var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var restaurantUtil = require("./restaurant-util");
var _ = require("underscore");

var _DATA = restaurantUtil.loadData().restaurants;
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
  res.render('home', {
    data: _DATA
  });
});

app.get('/reset', function(req, res){
  restaurantUtil.restoreOriginalData();
  _DATA = restaurantUtil.loadData().restaurants;
  res.redirect('/');
});

app.get('/addRestaurant', function(req,res){
  res.render('addData');
});

app.post('/api/addRestaurant', function(req,res){
  var body = req.body;
  body.menu = body.menu.trim().replace(" ","").split(",");
  body.platforms = body.platforms.trim().replace(" ", "").split(",");
  body.open = restaurantUtil.formatAMPM(body.open);
  body.close = restaurantUtil.formatAMPM(body.close);
  body.time = parseInt(body.time);
  _DATA.push(req.body);
  restaurantUtil.saveData(_DATA);
  res.redirect('/');
});

app.get('/api/getRestaurants', function(req,res){
  res.render('getRestaurants',{
    data: JSON.stringify(_DATA)
  });
});

app.get('/grubhub', function(req, res) {
  var temp = [];
  _DATA.forEach((element) => {
    var pl = element.platforms;
    var output = false;
    for(var i = 0; i < pl.length; i++){
      if(pl[i].trim().toLowerCase().includes("grubhub")){
        output = true;
      }
    }
    if(output == true){
      temp.push(element);
    }
  });
  res.render('grubhub',
  {
    data: temp
  });
});

app.get('/9AM', function(req, res) {
    var temp = [];
    _DATA.forEach((element) => {
      var semi = element.open.indexOf(":");
      var space = element.open.indexOf(" ");
      var em = element.open.indexOf("M");
      var hours = parseInt(element.open.substring(0,semi));
      var mins = parseInt(element.open.substring(semi+1,space+1));
      var ampm = element.open.substring(em-1,em+1);
      if(ampm == "AM"){
        if(hours < 9 || hours == 9 && mins == 0){
          temp.push(element);
        }
      }
    });
  res.render('9AM',
  {
    data: temp
  });
});

app.get('/milkshakes', function(req, res) {
  var temp = [];
  _DATA.forEach((element) => {
    var pl = element.menu;
    var output = false;
    for(var i = 0; i < pl.length; i++){
      if(pl[i].trim().toLowerCase().includes("milkshake")){
        output = true;
      }
    }
    if(output == true){
      temp.push(element);
    }
  });
  res.render('milkshake',
  {
    data: temp
  });
});

app.get('/deliveryTime', function(req, res) {
  var map = new Map();
  var temp = [];
  var sorted = [];
  var i = 0;
  _DATA.forEach((element) => {
    map.set(element.time, element);
    sorted[i] = element.time;
    i += 1;
  });
  sorted = sorted.sort();
  for(var j = 0; j < sorted.length; j++){
    temp.push(map.get(sorted[j]));
  }
  res.render('deliveryTime', {
    data: temp
  });
});

app.get('/midnight', function(req, res) {
  var temp = [];
  _DATA.forEach((element) => {
    var semi = element.close.indexOf(":");
    var space = element.close.indexOf(" ");
    var em = element.close.indexOf("M");
    var hours = parseInt(element.close.substring(0,semi));
    var mins = parseInt(element.close.substring(semi+1,space+1));
    var ampm = element.close.substring(em-1,em+1);
    if(ampm == "AM" && hours <= 12 ){
      console.log("yep");
      temp.push(element);
    }
  });
  res.render('midnight',
  {
    data: temp
  });
});

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});
