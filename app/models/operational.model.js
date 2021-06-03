module.exports = (sequelize, Sequelize) => {
  const Operational = sequelize.define('operational', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING
    },
    unit: {
      type: Sequelize.STRING
    },
  }, {
    timestamps: false
  });

  return Operational;
};