const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const express = require('express');
const https = require('https');
const fs = require('fs');

// Local imports
const helpers = require('./helpers');
const mongo = require('./mongodb');
const graphql = require('./graphql');

// Init the express server
const app = express();
app.use(cors())

// Make the screenshots available publicly
app.use('/public', express.static('screenshots'));

// Serve the front-end publicly
app.use('/', express.static('build'));

// Init graphql server
const schema = graphql.getSchema();
schema.applyMiddleware({
	app
});

let SSLKey = '' + fs.readFileSync('./SSL-key', 'utf8');
SSLKey = SSLKey.trim();

// Start express on port 443 (secure)
https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: SSLKey
}, app)
.listen(443);

// Set up plain http server (not secure)
var http = express();

// set up a route to redirect http to https
http.get('*', function(req, res) {
	res.redirect('https://' + req.headers.host + req.url);
})

// have it listen on 80
http.listen(80);