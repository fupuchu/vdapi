const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Logging Tool
app.use(morgan("tiny"));

// Connect to Mongodb
const db = require("./config/keys").mongoURI || process.env.URI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Bring in models

const Groot = require("./models/Groot");

//Routes

// Testing Route
app.get("/", (req, res) => {
  res.status(200).json({
    key: "value"
  });
});

// GET ROUTE
// Retrieve information using req.params
// Returns an object with the relavant key pair
app.get("/object/:mykey", (req, res) => {
  console.log(req.query);
  if (req.query) {
    Groot.findOne({
      timestamp: req.query.timestamp
    });
  } else {
    Groot.findOne({
      key: req.params.mykey
    })
      .then(data => {
        if (!data) {
          res.status(400).json({ error: "No data found!" });
        } else {
          const output = {
            value: data.value
          };
          res.json(output);
        }
      })
      .catch(err => console.log(err));
  }
});

// POST ROUTE
// Overwrites the value if an there is an existing key

app.post("/object", (req, res) => {
  Groot.findOne({
    key: req.body.key
  }).then(output => {
    if (output) {
      Groot.findOneAndUpdate(
        // Reference findOneAndUpdate({what-to-find}, {what-to-update-with})
        { key: req.body.key },
        { value: req.body.value },
        { new: true }
      ).then(updated => res.json(updated));
    } else {
      const newGroot = new Groot({
        key: req.body.key,
        value: req.body.value,
        timestamp: Date.now()
      });
      newGroot
        .save()
        .then(groot => res.json(groot))
        .catch(err => console.log(err));
    }
  });
});

// GET ROUTE
// Get by key and timestamp

app.get("/object", (req, res) => {
  console.log(req.query);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on ${port}!`);
});
