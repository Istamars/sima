module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define('report', {
    createdAt: {
      type: Sequelize.DATEONLY
    },
    type: {
      type: Sequelize.STRING
    },
    dateOrMonthOrYear: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    projectId: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.project,
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
    isOperatorApproved: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.user,
        key: 'id'
      }
    },
    isOfficerApproved: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.user,
        key: 'id'
      }
    },
    isSiteManagerApproved: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.user,
        key: 'id'
      }
    },
    isProjectManagerApproved: {
      type: Sequelize.STRING,
      references: {
        model: sequelize.user,
        key: 'id'
      }
    }
  }, {
    timestamps: false
  });

  Report.removeAttribute('id');

  return Report;
};