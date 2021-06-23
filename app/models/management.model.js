module.exports = (sequelize, Sequelize) => {
  const Management = sequelize.define('management', {
    date: {
      type: Sequelize.DATEONLY,
    },
    isCleaned: {
      type: Sequelize.BOOLEAN
    },
    cleanlinessNote: {
      type: Sequelize.STRING
    },
    isReady: {
      type: Sequelize.BOOLEAN
    },
    readyNote: {
      type: Sequelize.STRING
    },
    location: {
      type: Sequelize.STRING
    },
    job: {
      type: Sequelize.STRING
    },
    returnTime: {
      type: Sequelize.STRING
    },
    feeHour: {
      type: Sequelize.INTEGER
    },
    feeKg: {
      type: Sequelize.INTEGER
    },
    initialHm: {
      type: Sequelize.STRING
    },
    finalHm: {
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

  Management.removeAttribute('id');

  return Management;
};