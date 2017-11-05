const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://10.0.98.28:1883');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
client.on('connect', () => {
	console.log("conectou");
	client.subscribe('movi/info')
});

var http = require("http");
http.createServer(function (req, res) {
    res.writeHeader(200, {
        "Content-Type": "text/event-stream"
        , "Cache-Control": "no-cache"
        , "Connection": "keep-alive"
        , "Access-Control-Allow-Origin": "*"
	});
	
    client.on('message', (topic, message) => {
		var clone = JSON.parse(JSON.stringify(decoder.write(message))); 
		if(topic === 'movi/info') {
			res.write("data: " + clone + "\n\n");
		}
	  });
}).listen(9090);
console.log('SSE-Server started!');
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}