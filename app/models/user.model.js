module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: false
  });

  return User;
};