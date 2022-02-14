const express = require("express");
const app = express();
const jsonParser = express.json;
const MongoClient = require("mongodb").MongoClient; //подключаем монгоДб
const url =
  "mongodb+srv://Orhan:Mamedov03Danskih09@cluster0.md34d.mongodb.net/TourOfHeroes?retryWrites=true&w=majority"; //подключаемся к базе данных в монгодб
const objectId = require("mongodb").ObjectId;

let dbClient;

const PORT = process.env.PORT || 3000;
//Connect to DB
MongoClient.connect(url, (err, client) => {
  //коннектимся через MongoClient, и добавляем второй параметр client
  if (err) return console.error(err);

  dbClient = client;
  app.locals.collection = client.db("TourOfHeroes").collection("heroes");
  //How to we start listening to the server
  app.listen(PORT, function () {
    console.log("Server running on localhost:" + PORT);
  });

  console.log("Connected to db");
});

//Our main page greetings
app.get("/", (req, res) => {
  res.send("You are located at localhost: " + PORT);
});

app.get("/api/heroes", (req, res) => {

  const collection = req.app.locals.collection;

  collection.find({}).toArray((err, heroes) => {
    if (err) return console.error(err);
    res.send(heroes);
  });

});

app.get("/api/heroes/:id", (req, res) => {

    const id = +req.params.id
    const collection = req.app.locals.collection;

    collection.findOne({id: id}, (err, hero) => {  
        if (err) return console.log(err);
        res.send(hero);
    });

});

app.post("/api/heroes", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  let hero = {
    name: req.body.name,
    age: req.body.userAge,
    heroLevel: req.body.heroLevel,
    alterEgo: req.body.alterEgo,
    heroRace: req.body.heroRace,
    heroClass: req.body.heroClass,
    power: req.body.power,
  };

  const collection = req.app.locals.collection;

  collection.insertOne(hero, (err, result) => {
    if (err) return console.log(err);
    res.send(hero);
  });

});

app.delete("/api/heroes/:id", (req, res) => {
  const id = new objectId(req.params.id);
  const collection = req.app.locals.collection;

  collection.findOneAndDelete({ _id: id }, (err, result) => {
    if (err) return console.log(err);
    let hero = result.value;
    res.send(hero);
  });

});

app.put("/api/heroes", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const id = new objectId(req.body.id);
  const name = req.body.name;
  const age = req.body.age;
  const heroLevel = req.body.heroLevel;
  const alterEgo = req.body.alterEgo;
  const heroRace = req.body.heroRace;
  const heroClass = req.body.heroClass;
  const power = req.body.power;

  const collection = req.app.locals.collection;

  collection.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        age: age,
        heroLevel: heroLevel,
        alterEgo: alterEgo,
        heroRace: heroRace,
        heroClass: heroClass,
        power: power,
      },
    },
    { returnDocument: "after" },
    (err, result) => {
      if (err) return console.log(err);
      const hero = result.value;
      res.send(hero);
    }
  );

});
