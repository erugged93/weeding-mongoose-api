const express = require('express');
const bodyParser = require('body-parser');



const app = express();

// function supportCrossOriginScript(req, res, next) {
//     res.status(200);
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//
//     // res.header("Access-Control-Allow-Headers", "Origin");
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // res.header("Access-Control-Allow-Methods","POST, OPTIONS");
//     // res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
//     // res.header("Access-Control-Max-Age","1728000");
//     next();
// }
// app.all('/result', supportCrossOriginScript);
const mongoose = require('mongoose');
var userName = "";
var password = "";
process.argv.forEach(function (val, index) {
  if(index==2) {
    userName=val;
  }
  else if (index==3) {
    password=val;
  }
});

var url = "mongodb://"+userName+":"+password+"@ericproductionhome-shard-00-00-qxfv2.mongodb.net:27017,ericproductionhome-shard-00-01-qxfv2.mongodb.net:27017,ericproductionhome-shard-00-02-qxfv2.mongodb.net:27017/Wedding?ssl=true&replicaSet=EricProductionHome-shard-0&authSource=admin";
mongoose.connect(url);
var db = mongoose.connection;

const Guests = require('./app/guestsModel.js');

app.enable("jsonp callback");
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
      console.log(err);
    res.jsonp(guests);
  });
});

app.post('/guests', (req,res) => {
  console.log("Eric");
  Guests.create({
    name: req.query.name,
    family: req.query.family,
    bridal_party: false,
    notDrinking: req.query.notDrinking,
    plusOne: req.query.plusOne
  }, (err,guests) => {
    if(err)
      console.log(handleError(err));

    Guests.find((err,guests) => {
      if(err)
        console.log(handleError(err));
      // res.setHeader('Content-Type', 'application/javascript');
      // res.jsonp(guests);
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
