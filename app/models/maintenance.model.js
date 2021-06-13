module.exports = (sequelize, Sequelize) => {
    const Maintenance = sequelize.define('maintenance', {
      startDate: {
        type: Sequelize.DATEONLY
      },
      endDate: {
        type: Sequelize.DATEONLY
      },
      type: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      unitPrice: {
        type: Sequelize.INTEGER,
      },
      mechanicId: {
        type: Sequelize.STRING,
        references: {
          model: sequelize.mechanic,
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
  
    Maintenance.removeAttribute('id');
  
    return Maintenance;
  };