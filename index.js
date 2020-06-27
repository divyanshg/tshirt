var cors = require('cors')
const express = require('express');
const app = express();
const fs = require('fs');

const options = {
    key: fs.readFileSync('../private.key'),
    cert: fs.readFileSync('../certificate.crt'),
    ca: [fs.readFileSync('../ca_bundle.crt')]
};

var http = require('https');

var server = http.createServer(options, app).listen(30021, function () {
    console.log('Server ready ' + 30021);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
});