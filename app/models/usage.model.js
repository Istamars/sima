module.exports = (sequelize, Sequelize) => {
  const Usage = sequelize.define('usage', {
    mobilization: {
      type: Sequelize.DATEONLY,
    },
    demobilization: {
      type: Sequelize.DATEONLY
    },
    toolId: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.tool,
        key: 'id'
      }
    },
    projectId: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.project,
        key: 'id'
      }
    },
  }, {
    timestamps: false
  });

  Usage.removeAttribute('id');

  return Usage;
};