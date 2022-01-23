const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient; //подключаем монгоДб
const url = 'mongodb+srv://Orhan:Mamedov03Danskih09@cluster0.md34d.mongodb.net/TourOfHeroesDt?retryWrites=true&w=majority'; //подключаемся к базе данных в монгодб
const api = require('./routes/api');

const PORT = process.env.PORT || 3000;
//Connect to DB
MongoClient.connect(url, (err) => { //коннектимся через MongoClient, и добавляем второй параметр client
    if (err) {
        console.log('Connection error', err);
        throw err;
    }; 

    console.log('Connected to db');

});

//Middleware
app.use(express.json());
app.use('/api', api);
app.use('/api/heroes', api);
app.use('/api/heroes/:id', api);

//Our main page greetings
app.get('/', (req, res) => {
    res.send('Hello from Server');
});

//How to we start listening to the server
app.listen(PORT, function () {
    console.log('Server running on localhost:' + PORT);
});

