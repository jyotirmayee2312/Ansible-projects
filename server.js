const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

// Replace 'http://13.232.169.235' with your frontend's domain or IP address
const frontendDomain = 'http://13.232.169.235:3000';

app.use(cors({
  origin: frontendDomain,
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

const mongoUri = "mongodb+srv://jyotirmayee:Aim40Lpa@jyoticluster.ibau2sz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const databaseName = "user-account";

app.post('/update-profile', function (req, res) {
  const userObj = req.body;

  client.connect(function (err) {
    if (err) throw err;

    const db = client.db(databaseName);
    userObj['userid'] = 1;

    const myquery = { userid: 1 };
    const newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, { upsert: true }, function (err, result) {
      if (err) throw err;
      // Send response
      res.send(userObj);
    });
  });
});

app.get('/get-profile', function (req, res) {
  let response = {};

  client.connect(function (err) {
    if (err) throw err;

    const db = client.db(databaseName);

    const myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;

      // Send response
      res.send(response ? response : {});
    });
  });
});

client.connect(function (err) {
  if (err) throw err;

  app.listen(3000, function () {
    console.log("App listening on port 3000!");
  });
});
