var express = require('express');
const got = require('got');
var app = express();

const {Wit, log} = require('node-wit');
const client = new Wit({
  accessToken: "F3GLVWDI3U5US6FNMO57X3JIFT7ASNZH"
});

const noresponse = [{"message": "Sorry I don't know about that yet. Try Google, they're a little smarter :)"}]; 
const templateresponse = [{"message": "", "embed": {"message": "", "url": ""}, "suggest": []}]; 

//your routes here
app.get('/:message', function (req, res) {
	client.message(req.params.message, {})
	.then((raw_data) => {
		// var data = JSON.stringify(raw_data)
		// get search topic 
		var search_topic = raw_data.entities.wikipedia_search_query[0].value
		// search it in graph 
    	got("https://learn-anything.xyz/api/maps/?q=" + encodeURI(search_topic))
		.then(search_response => {
			var search_results = JSON.parse(search_response.body); 
			var obj; 
			if (search_results.length == 0) {
				obj = noresponse; 
			} else {
				obj = search_results[0]; 
			}
			console.log("https://learn-anything.xyz/api/maps/" + obj.id)
			got("https://learn-anything.xyz/api/maps/" + obj.id)
			.then(map_response => {
				// compile the results
				var map_results = JSON.parse(map_response.body); 
				var returnmessage = templateresponse; 
				
				let wikinode = map_results.nodes.find(o => o.category === 'wiki');
				returnmessage.message = "Find out more about " + obj.key + " here: " + wikinode.url;

				let preembednode = map_results.nodes.find(o => o.text === 'basics'); 
				let embednode = preembednode.nodes.find(o => o.category === 'video');
				returnmessage.embed.message = "Check out this video: " + embednode.text; 
				returnmessage.embed.url = embednode.url; 

				let suggestnodes = map_results.nodes.filter( o => o.category == 'mindmap' );
				for (node in suggestnodes) { returnmessage.suggest.push({"title": node.text, "url": node.url}) }

				// send it back
				console.log(returnmessage)
				res.send(returnmessage); 

			}).catch(search_error => {
				console.log("Map API Error");
				console.log(error.response.body);
			});

		}).catch(search_error => {
			console.log("Search API Error");
			console.log(error.response.body);
		});
	})
	.catch(console.error);
});

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
