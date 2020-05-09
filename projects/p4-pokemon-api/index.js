var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json.
// Leave this here if you want to restore the original dataset
// and reverse the edits you made.
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state
// after you restard your server.
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable.
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser. No need to touch this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    var contents = "";
    var x = 1;
    _.each(_DATA, function(i) {
        contents += `<tr><td>`+ x +`</td><td><a href="/pokemon/`+ x +`">`+ i.name +`</a></td></tr>\n`;
        x = x+1;
    })
    var html = `<html>\n<body>\n<table>` + contents +`</table>\n</body>\n</html>`;
    res.send(html);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    // HINT :
    var _id = parseInt(req.params.pokemon_id);
    var contents = "";
    var result = _.findWhere(_DATA, { id: _id });
    if (!result){
      contents = "<p>Error: Pokemon not found</p>"
    }else{
    var keys = Object.keys(result);

    var x = 0;
    _.each(result, function(i) {
        contents += `<tr><td>`+ keys[x] +`</td><td>`+ JSON.stringify(i) +`</td></tr>\n`;
        x=x+1;
    })
  }
    var html = `<html>\n<body>\n<table>` + contents +`</table>\n</body>\n</html>`;
    res.send(html);
    //res.send("UNIMPLEMENTED ENDPOINT");
    //`<tr><td>${i}</td><td>${JSON.stringify(result[i])}</td></tr>\n`;
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result){
      contents = "<html>\n<body>\n<p>Error: Pokemon not found</p>\n</body>\n</html>";
    }
    var html = `<html>\n<body>\n<img src='`+ result.img +`'>\n</body>\n</html>`;
    res.send(html);
});

app.get("/api/id/:pokemon_id", function(req, res) {
    // This endpoint has been completed for you.
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
    var _name = req.params.pokemon_name;
    var result = [];
    var temp = _.findWhere(_DATA, { name: _name });
    var str = JSON.stringify(temp);
    if(_name.localeCompare("") != 0 && str != undefined){
        var pr = temp.prev_evolution;
        if(pr != undefined){
          result.push(pr[0].name);
        }
        result.push(_name);
        // var nxt = temp.next_evolution;
        // if(nxt[0] != undefined){
        //   result.push(nxt[0].name);
        // }
    }
    res.send(result);
});

app.get("/api/type/:type", function(req, res) {
  var _type = req.params.type;
  var temp = _DATA.filter(x => x.type.includes(_type)).map(x => x.name);
  var str = JSON.stringify(temp);
  res.send(temp);
});

app.get("/api/type/:type/heaviest", function(req, res) {
  var _type = req.params.type;
  if(_type != "notatype"){
    var temp = _DATA.filter(x => x.type.includes(_type)).map(x => {
      rObj = { name: x.name, weight: parseInt(x.weight) }
      return rObj
    });
    var output = _.max(temp, function(y){ return y.weight; });
    res.send(output);
  }
  else{
    res.send({});
  }
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    // HINT:
    var _name = req.params.pokemon_name;
    var _weakness = req.params.weakness_name;
    var result = [];
    var temp = _.findWhere(_DATA, { name: _name });
    var str = JSON.stringify(temp);
    if(str != undefined){
      var output = _DATA.filter(x => x.name == _name).map(x => {
        rObj = { name: x.name, weaknesses: x.weaknesses }
        return rObj
      });
      var arr = output[0].weaknesses;
      if(!(arr.includes(_weakness))){
        arr.push(_weakness);
        output[0].weaknesses = arr;
    }
      pokeDataUtil.saveData(_DATA);
      res.send(output[0]);
    }
    else{
      res.send({});
    }
    //res.send(output);
});

app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
  var _name = req.params.pokemon_name;
  var _weakness = req.params.weakness_name;
  var result = [];
  var temp = _.findWhere(_DATA, { name: _name });
  var str = JSON.stringify(temp);
  if(str != undefined){
    var output = _DATA.filter(x => x.name == _name).map(x => {
      rObj = { name: x.name, weaknesses: x.weaknesses }
      return rObj
    });
    var arr = output[0].weaknesses;
    if(arr.includes(_weakness)){
      var index = arr.indexOf(_weakness);
      if(index > -1){
        arr.splice(index,1);
      }
      //var newArr = arr.filter(x => x !== _weakness);
      output[0].weaknesses = arr;
  }
    pokeDataUtil.saveData(_DATA);
    res.send(output[0]);
  }
  else{
    res.send({});
  }
});


// Start listening on port PORT
app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
