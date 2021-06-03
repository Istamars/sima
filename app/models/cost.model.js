module.exports = (sequelize, Sequelize) => {
  const Cost = sequelize.define('cost', {
    date: {
      type: Sequelize.DATEONLY
    },
    unitCost: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.user,
        key: 'id'
      }
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
    operationalId: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.operational,
        key: 'id'
      }
    },
  }, {
    timestamps: false
  });

  Cost.removeAttribute('id');

  return Cost;
};