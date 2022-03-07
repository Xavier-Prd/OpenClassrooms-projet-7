const {Sequelize} = require('sequelize');
require('dotenv').config()
const bdd = new Sequelize (process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    dialect:'mysql',
    host: process.env.DBHOST
});
const connect = async () => {
    try{
        await bdd.authenticate();
        console.log('bdd connectée');
    }
    catch(error){
        console.error(error);
    }
}

module.exports = {connect, bdd};