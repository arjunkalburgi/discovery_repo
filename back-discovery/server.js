var express = require('express');
var app = express();

const {Wit, log} = require('node-wit');
const client = new Wit({
  accessToken: "F3GLVWDI3U5US6FNMO57X3JIFT7ASNZH",
  logger: new log.Logger(log.DEBUG) // optional
});

const var noresponse = {}; 
const var templateresponse = {}; 

//your routes here
app.get('/:message', function (req, res) {
	client.message(req.params.message, {})
	.then((raw_data) => {
		// var data = JSON.stringify(raw_data)
		// get search topic 
		var search_topic = raw_data.entities.wikipedia_search_query[0].value
		// search it in graph 
    	fetch("https://learn-anything.xyz/api/maps/?q=" + search_topic)
    		.then(function(search_response) {
    			var obj; 
    			if (len(search_response) == 0) {
    				obj = noresponse; 
    			} else {
    				obj = search_response[0]; 
    			}
    			console.log(JSON.stringify(search_response))
    			fetch("https://learn-anything.xyz/api/maps/" + obj.id); 
    				.then(function(map_response) {
    					/*
							var main = map_response.nodes[0] ({})
							var additional = map_response.nodes[1] ([{}, {}])
    					*/
    					console.log(JSON.stringify(map_response))
    				}); 
    		}); 
		console.log('Yay, got Wit.ai search term: ' + search_topic);
	})
	.catch(console.error);
});

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
