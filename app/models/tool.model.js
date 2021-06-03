module.exports = (sequelize, Sequelize) => {
  const Tool = sequelize.define('tool', {
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

  return Tool;
};