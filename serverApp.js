const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
var url = "mongodb://@ericproductionhome-shard-00-00-qxfv2.mongodb.net:27017,ericproductionhome-shard-00-01-qxfv2.mongodb.net:27017,ericproductionhome-shard-00-02-qxfv2.mongodb.net:27017/Wedding?ssl=true&replicaSet=EricProductionHome-shard-0&authSource=admin";
mongoose.connect(url);
var db = mongoose.connection;

const Guests = require('./app/guestsModel.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
db.once('open', function() {
  app.listen(3000, () => {
    console.log('App listening on port 3000');
  });
});

app.get('/guests', (req,res) => {
  Guests.find((err,guests) => {
    if(err)
      console.log(handleError(err));
    res.json(guests);
  });
});

app.post('/guests', (req,res) => {
  Guests.create({
    name: req.query.name,
    family: req.query.family,
    bridal_party: req.query.bridal_party,
    notDrinking: false,
    plusOne: false
  }, (err,guests) => {
    if(err)
      console.log(handleError(err));
    Guests.find((err,guests) => {
      if(err)
        console.log(handleError(err));
      res.json(guests);
    });
  });
});

app.put('/guests/:id', (req, res) => {
    Guests.findById(req.params.id, (err, guest) => {
        guest.update(req.query, (err, guests) => {
            if (err)
                console.log(handleError(err));
            Guests.find((err,guests) => {
                  if(err)
                    console.log(handleError(err));
                  res.json(guests);
              });
        });
    });
});
