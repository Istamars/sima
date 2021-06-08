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
      mechanic: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      unitPrice: {
        type: Sequelize.INTEGER,
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