const {bdd} = require('./connexion');
const {DataTypes} = require('sequelize');

const User = bdd.define('User', {
    email : {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username : {
        type: DataTypes.STRING
    },
    password : {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;

