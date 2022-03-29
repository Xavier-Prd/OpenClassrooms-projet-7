const User = require('./user');
const Message =  require('./message');
const {bdd} = require('./connexion');
const Comment = require('./comment');

const loadModel = async () => {
Message.belongsTo(User, {foreignKey: 'userId'})
Comment.belongsTo(User, {foreignKey: 'userId'})
Message.hasMany(Comment, {foreignKey: 'messageId'})
bdd.sync();
}

module.exports = loadModel;