const {bdd} = require('../models/connexion.js');
const {DataTypes} = require('sequelize');

const User = bdd.define('User', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username : {
        type: DataTypes.STRING,
        allowNull: false

    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    },
    role : {
        type: DataTypes.ENUM(['admin', 'user'])
    },
    imageUrl : {
        type : DataTypes.STRING
    }
});

module.exports = User;

