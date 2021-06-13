module.exports = (sequelize, Sequelize) => {
    const Mechanic = sequelize.define('mechanic', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
    }, {
      timestamps: false
    });
  
    return Mechanic;
  };