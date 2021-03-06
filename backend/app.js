const express = require('express');
const helmet = require("helmet");
const app = express();
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const commentRoutes = require('./routes/comment');

const path = require('path');

const {connect} = require('./models/connexion');
const loadModel = require('./models/index');

connect();
loadModel();

app.use(helmet({crossOriginEmbedderPolicy: false,crossOriginResourcePolicy: false,}));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, X-Auth-Token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/auth', userRoutes);
  app.use('/api/auth', messageRoutes);
  app.use('/api/auth', commentRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;