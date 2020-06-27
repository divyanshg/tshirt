var cors = require('cors')
const express = require('express');
const app = express();
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://192.168.31.72:27017/";

const options = {
    key: fs.readFileSync('../private.key'),
    cert: fs.readFileSync('../certificate.crt'),
    ca: [fs.readFileSync('../ca_bundle.crt')]
};

var http = require('https');

var server = http.createServer(options, app).listen(30021, function () {
    console.log('Server ready ' + 30021);
});

var dataCamp;

MongoClient.connect(url, {
    useUnifiedTopology: true
}, function (err, db) {
    if (err) throw err;
    dataCamp = db.db("fila_iot");
});

app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/fa.html')
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
});

app.get('/:user/:pass', (req, res) => {
    dataCamp.collection("users").find({
        username: req.params.user,
        password: req.params.pass
    }).toArray((err, resp) => {
        if (err) return err;

        if (resp.length == 0) {
            res.json({
                status: 404
            });
            res.end();
            return;
        } else {
            res.json({
                status: 200
            })
            res.end()
        }
    })
});

app.get('/s/:user/:pass', (req, res) => {
    dataCamp.collection("users").insertOne({
        username: req.params.user,
        password: req.params.pass
    }, (err, res) => {
        if (err) {res.json({status: 404 });res.end();return;}
        res.json({status: 200})
        res.end()
    })
});