var express = require("express");
var logfmt = require("logfmt");
var parser = require('bless').Parser;
var app = express();

app.use(logfmt.requestLogger());

app.post('/:name.css', function(request, response) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	var bless = new parser({
		"output": request.params.name + ".css",
		"options": {}
	});

	var cssData = "";
	request.on('data', function (data) { cssData += data; });
	request.on('end', function () {
		bless.parse(cssData, function (error, files, numSelectors) {
			response.end(JSON.stringify({
				"error": error,
				"files": files,
				"numSelectors": numSelectors
			}));
		});
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});
