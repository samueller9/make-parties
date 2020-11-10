const bcrypt = require('bcrypt')

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: Datatypes.STRING
    passwordDigest: DataTypes.STRING,
  })

  User.associate = function(models) {

  }

  return User;
};
