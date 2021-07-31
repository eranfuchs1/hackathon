let util = require('util');
let express = require('express');
let app = express();
let data = {};
let bodyParser = require('body-parser');
app.use(bodyParser({limit: '100mb'}));
app.use( bodyParser.json() );

app.all('/api', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next()
});

app.listen(3000, ()=> {
	console.log('app');
});


app.get("/api", (req, res, next) => {
	res.json(data[req.query['xy']]);
	next();
});

app.post("/api", (req, res, next) => {
	data[req.body['xy']] = req.body['data'];
	next();
});
