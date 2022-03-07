const User = require('./user');

const loadModel = async () => {
User.sync();
}

module.exports = loadModel;