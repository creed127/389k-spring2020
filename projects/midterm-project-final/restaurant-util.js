var fs = require('fs');

function restoreOriginalData() {
    fs.writeFileSync('data.json', fs.readFileSync('data-original.json'));
}

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
	// poke.json stores the pokemon array under key "pokemon",
	// so we are recreating the same structure with this object
	var obj = {
		restaurants: data
	};

	fs.writeFileSync('data.json', JSON.stringify(obj));
}

function formatAMPM(time) {
  var hours = time.substring(0,2);
  var minutes = time.substring(3,5);
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  // minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

module.exports = {
    formatAMPM: formatAMPM,
    restoreOriginalData: restoreOriginalData,
    loadData: loadData,
    saveData: saveData,
}
