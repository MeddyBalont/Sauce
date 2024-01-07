//
const mongoose = require('mongoose');

//Framework Express
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const app = express();

//Framework dotenv pour cacher les données sensibles
const dotenv = require('dotenv');
const result = dotenv.config();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});  

//Connection Mongoose
mongoose.connect(process.env.MONGO_URL,
  //{ useNewUrlParser: true,
    //useUnifiedTopology: true }
    )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Transformer le body en JSON. 
app.use(express.json());

//Routes//
app.use('/api/sauces', bodyParser.json());
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//Accéder à l'image avec la fonction middleware "express.static".
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;