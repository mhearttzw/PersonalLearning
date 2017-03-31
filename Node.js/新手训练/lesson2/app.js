var express = require("express"),
	utility  = require("utility");

var app = express();

app.get('/', function(req, res) {
	var q = req.query.q;
	if (q) {
		var md5Value = utility.md5(q);
		res.send(md5Value);	
	} else {
		res.send('hello echelon');
	}
	
});

app.listen(3000, function(req, res) {
	console.log('app is running at port 3000');
});
