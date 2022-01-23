const express = require("express");
const route = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

route.get("/", (req, res) => {
  res.send("Welcome from the Api!");
});

//получение списка данных
route.get("/api/heroes", (req, res) => {
  let content = fs.readFileSync("../users/heroes.js", "utf8");
  let heroes = JSON.parse(content);
  res.send(heroes);
});

//получение одного героя по id
route.get("/api/heroes/:id", (req, res) => {
  let id = req.params.id; //получаем id
  let content = fs.readFileSync("../users/heroes.js", "utf8");
  let heroes = JSON.parse(content);
  let hero = null;
  //находим в массиве героя по id
  for (let i = 0; i < heroes.length; i++) {
    if (heroes[i].id == id) {
      hero = heroes[i];
      break;
    }
  }
  //отправляем героя
  if (hero) {
    res.send(hero);
  } else {
    res.status(404).send();
  }
});
//получение отправленных данных
route.post("/api/heroes", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  let userName = req.body.name;
  let userAge = req.body.age;
  let heroLevel = req.body.level;
  let alterEgo = req.body.ego;
  let heroRace = req.body.race;
  let heroClass = req.body.class;
  let power = req.body.power;

  let hero = {
    name: userName,
    age: userAge,
    heroLevel: heroLevel,
    alterEgo: alterEgo,
    heroRace: heroRace,
    heroClass: heroClass,
    power: power,
  };

  let data = fs.readFileSync("../users/heroes.js", "utf8");
  let heroes = JSON.parse(data);

  //находим максимальный id
  let id = Math.max.apply(
    Math,
    heroes.map(function (o) {
      return o.id;
    })
  );
  //увеличиваем его на единицу
  hero.id = id + 1;
  //добавляем героя в массив
  heroes.push(hero);
  let datas = JSON.stringify(heroes);
  //перезаписываем файл с новыми данными
  fs.readFileSync("../users/heroes.js", datas);
  res.send(hero);
});

//удаление героя по id
route.delete("/api/heroes/:id", (req, res) => {
  let id = req.params.id;
  let data = fs.readFileSync("../users/heroes.js", "utf8");
  let heroes = JSON.parse(data);
  let index = -1;
  //находим индекс героя в массиве
  for (let i = 0; i < heroes.length; i++) {
    if (heroes[i].id == id) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    //удалеям героя из массива по индексу
    let hero = heroes.splice(index, 1)[0];
    let data = JSON.stringify(heroes);
    fs.readFileSync("../users/heroes.js", data);
    //отправляем удалённого героя
    res.send(hero);
  } else {
    res.status(404).send();
  }
});
//изменение героя
route.put("/api/heroes", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);

  let heroId = req.body.id;
  let userName = req.body.name;
  let userAge = req.body.age;
  let heroLevel = req.body.level;
  let alterEgo = req.body.ego;
  let heroRace = req.body.race;
  let heroClass = req.body.class;
  let power = req.body.power;

  let data = fs.readFileSync("../users/heroes.js", "utf8");
  let heroes = JSON.parse(data);
  let hero;
  for (let i = 0; i < heroes.length; i++) {
    if (heroes[i].id == heroId) {
      hero = heroes[i];
      break;
    }
  }
  //изменяем данные у героя
  if (hero) {
    hero.name = userName;
    user.age = userAge;
    hero.level = heroLevel;
    alter.ego = alterEgo;
    hero.race = heroRace;
    hero.class = heroClass;
    power = power;

    let data = JSON.stringify(heroes);
    fs.readFileSync("../users/heroes.js", data);
    res.send(hero);
  } else {
    res.status(404).send(hero);
  }
});

module.exports = route;
