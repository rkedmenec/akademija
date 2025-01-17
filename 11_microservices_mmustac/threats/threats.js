const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const port = process.argv.slice(2)[0];
const app = express();

app.use(bodyParser.json());

const heroesService = 'http://localhost:8888';

const threats = [
    {
        id: 1,
        displayName: 'Pisa tower is about to collapse.',
        necessaryPowers: ['flying'],
        img: 'tower.jpg',
        assignedHero: 0
    },
    {
        id: 2,
        displayName: 'Engineer is going to clean up server-room.',
        necessaryPowers: ['teleporting'],
        img: 'mess.jpg',
        assignedHero: 0
    },
    {
        id: 3,
        displayName: 'John will not understand the joke',
        necessaryPowers: ['clairvoyance'],
        img: 'joke.jpg',
        assignedHero: 0
    }
];

app.get('/threats', (req, res) => {
    console.log('Returning threats list');
    res.send(threats);
});

app.get('/getbug', (req, res) => {
    request.get({
        headers: { 'content-type': 'application/json' },
        url: `${heroesService}/callbug`,
    }, (err, heroResponse, body) => {
        if (!err) {
            res.status(202).send(heroResponse.body);
        } else {
            res.status(400).send({ problem: `Bug Service responded with issue ${err}` });
        }
    });
});

app.post('/assignment', (req, res) => {
    request.post({
        headers: { 'content-type': 'application/json' },
        url: `${heroesService}/hero/${req.body.heroId}`,
        body: `{
          "busy": true
      }`
    }, (err, heroResponse, body) => {
        if (!err) {
            const threatId = parseInt(req.body.threatId);
            const threat = threats.find(subject => subject.id === threatId);
            threat.assignedHero = req.body.heroId;
            res.status(202).send(threat);
        } else {
            res.status(400).send({ problem: `Hero Service responded with issue ${err}` });
        }
    });
});

app.use('/img', express.static(path.join(__dirname, 'img')));

console.log(`Threats service listening on port ${port}`);
app.listen(port);