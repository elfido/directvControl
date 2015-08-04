var os = require("os"),
	net = require("net"),
	ifaces = os.networkInterfaces(),
	_ = require("underscore");

var DiscoverService = {
	ipCollection: [],
	checkFinal: function(callback, services){
		if (this.counter >= 253){
			console.log("done");
			setTimeout(function(){
				callback(services)
			}, 2000);
			return(true);
		} else{
			return(false);
		}
	},
	remove: function(ip){
		//console.log("removing "+ip.toString());
		console.log("here",this.services);
		this.services = _.filter(this.services,function(item){
			console.log("comparing ",item.toString(), " to ", ip.toString());
			if (item.toString() != ip.toString())
				return(item);
		});
		console.dir(this.services);
	},
	discover: function( options, callback ){
		//By default use ipcollection[0], use an argument to explore the rest of the netinterfaces
		var _port = options.port,
			//services = [],
			segments = this.ipCollection[0].split("."),
			root = segments[0]+"."+segments[1]+"."+segments[2]+".",
			_this = this;
		this.services = [];
		this.counter = 0;
		for (var i=1;i<255;i++){
			var ip = root + i,
				client = net.connect({port: _port, host: ip}, function( host ){
					//console.log(host);
					//console.log("Found "+host);
					//console.dir(this);
					_this.services.push(host);
					_this.counter++;
					_this.checkFinal(callback, _this.services);
				}.call(null,ip));

				client.on("data", function(data){
					console.log(data);
					_this.counter++;
					//_this.checkFinal(callback, services);
				});	

				client.on("error", function(){
					_this.remove( this.toString() );
					console.log("failed",this.toString());
					_this.counter++;
					_this.checkFinal(callback, this.services);
				}.bind(ip));	
		}
		//callback(services);
	},
	printInterfaces: function(){
		_(this.ipCollection).each(function( ip ){
			console.log( ip );
		});
	},
	reset: function(){
		this.ipCollection = [];
	},
	readInterfaces: function(){
		var _this = this;
		_( ifaces ).each( function(interface){
			_( interface ).each( function( netInfo ){
				if (netInfo.family == "IPv4" && netInfo.internal === false){
					_this.ipCollection.push( netInfo.address );
				}
			});
		});
	},
	init: function(){
		this.reset();
		this.readInterfaces();
	}
};

// var net = require("net"),
// 	client = net.connect({port: 27161, host:"192.168.1.9"}, function(){
// 		console.log("connected?");
// 	});

// client.on("data", function(data){
// 	console.log(data.toString());
// });

// client.on("end", function(){
// 	console.log("disconnected");
// });

module.exports = DiscoverService;