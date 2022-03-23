const {bdd} = require('../models/connexion.js');
const {DataTypes} = require('sequelize');

const Comment = bdd.define('Comment', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    messageId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl : {
        type: DataTypes.STRING
    }
});

module.exports = Comment;