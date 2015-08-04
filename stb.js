var discovery = require("./discover.js"),
	Client = require("node-rest-client").Client,
	_ = require("underscore");

var app = {
	stbs: [],
	def: "192.168.1.9",
	getProgramInfo: function(){
		var url = "http://"+this.def+":8080/tv/getProgInfo?major=501",
		client = new Client();
		client.get(url, function(data, response){
            console.log(data.toString());
        });
	},
	sendCommand: function(command){
		var url = "http://"+this.def+":8080/remote/processKey?key="+command+"&hold=keyPress",
			client = new Client();
		console.log(command);
		//url = "http://192.168.1.9:8080/info/getVersion";
		client.get(url, function(data, response){
            // parsed response body as js object 
            //console.log(JSON.stringify(data.toString()));
            //console.log(data.toString());
            // raw response 
            //console.log(response);
        });
	},
	cmd: function(key, times){
		var _this = this;
		//console.log("here?",key,times);
		for(var i=0; i<times; i++){
			console.log(key,i);
			setTimeout(function(){
				_this.sendCommand(key);
			}, i*300);
		}
	},
	sendTextCommand: function(text){
		text = text.toLowerCase();
		var _this = this,
			keysTime = 2700,
			counter = 0,
			map = {
				" ": {key: "0", tap: 1},
				"a": {key: "2", tap: 1},
				"b": {key: "2", tap: 2},
				"c": {key: "2", tap: 3},
				"d": {key: "3", tap: 1},
				"e": {key: "3", tap: 2},
				"f": {key: "3", tap: 3},
				"g": {key: "4", tap: 1},
				"h": {key: "4", tap: 2},
				"i": {key: "4", tap: 3},
				"j": {key: "5", tap: 1},
				"k": {key: "5", tap: 2},
				"l": {key: "5", tap: 3},
				"m": {key: "6", tap: 1},
				"n": {key: "6", tap: 2},
				"o": {key: "6", tap: 3},
				"p": {key: "7", tap: 1},
				"q": {key: "7", tap: 2},
				"r": {key: "7", tap: 3},
				"s": {key: "7", tap: 4},
				"t": {key: "8", tap: 1},
				"u": {key: "8", tap: 2},
				"v": {key: "8", tap: 3},
				"w": {key: "9", tap: 1},
				"x": {key: "9", tap: 2},
				"y": {key: "9", tap: 3},
				"z": {key: "9", tap: 4}
			};
		_(text).each(function(key){
			setTimeout(function(){
				console.log("Processing "+key);
				def = map[key];
				setTimeout(function(){
					_this.cmd(def.key, def.tap);
				}, 10);
			}, (counter++)*keysTime);
		});
		setTimeout(function(){
			_this.sendCommand("red");
			setTimeout(function(){
				_this.sendCommand("select");
			},keysTime);
			
		}, counter*keysTime);
	},
	init: function(){
		var _this = this;
		discovery.init();
		stbs = discovery.discover({port: 27161}, function( stbs ){
			console.dir(stbs);
		});
	}
};

//app.init();
//app.getProgramInfo();
app.sendTextCommand("AALL SPORTS FOOTBALL LIVE CCAT");