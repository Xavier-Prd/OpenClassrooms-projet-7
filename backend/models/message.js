const {bdd} = require('../models/connexion.js');
const {DataTypes} = require('sequelize');

const Message = bdd.define('Message', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // userId : {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // },
    message : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl : {
        type: DataTypes.STRING
    }
});

module.exports = Message;