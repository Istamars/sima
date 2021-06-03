module.exports = (sequelize, Sequelize) => {
  const Operation = sequelize.define('operation', {
    date: {
      type: Sequelize.DATEONLY,
    },
    startTime: {
      type: Sequelize.STRING
    },
    endTime: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
    productionResult: {
      type: Sequelize.INTEGER
    },
    unit: {
      type: Sequelize.STRING
    },
    info: {
      type: Sequelize.STRING
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
  }, {
    timestamps: false
  });

  Operation.removeAttribute('id');

  return Operation;
};