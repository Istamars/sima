const config = require('../config/db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Define model here
db.user = require('./user.model')(sequelize, Sequelize);
db.tool = require('./tool.model')(sequelize, Sequelize);
db.project = require('./project.model')(sequelize, Sequelize);
db.operational = require('./operational.model')(sequelize, Sequelize);
db.operation = require('./operation.model')(sequelize, Sequelize);
db.management = require('./management.model')(sequelize, Sequelize);
db.cost = require('./cost.model')(sequelize, Sequelize);
db.usage = require('./usage.model')(sequelize, Sequelize);
db.report = require('./report.model')(sequelize, Sequelize);
db.maintenance = require('./maintenance.model')(sequelize, Sequelize);

// Define association here
db.user.hasMany(db.cost, {as: 'costs'});
db.tool.hasMany(db.cost, {as: 'costs'});
db.project.hasMany(db.cost, {as: 'costs'});
db.operational.hasMany(db.cost, {as: 'costs'});
db.cost.belongsTo(db.user, { foreignKey: 'userId' });
db.cost.belongsTo(db.tool, { foreignKey: 'toolId' });
db.cost.belongsTo(db.project, { foreignKey: 'projectId' });
db.cost.belongsTo(db.operational, { foreignKey: 'operationalId' });

db.user.hasMany(db.management, {as: 'managements'});
db.tool.hasMany(db.management, {as: 'managements'});
db.project.hasMany(db.management, {as: 'managements'});
db.management.belongsTo(db.user, { foreignKey: 'userId' });
db.management.belongsTo(db.tool, { foreignKey: 'toolId' });
db.management.belongsTo(db.project, { foreignKey: 'projectId' });

db.user.hasMany(db.operation, {as: 'operations'});
db.tool.hasMany(db.operation, {as: 'operations'});
db.project.hasMany(db.operation, {as: 'operations'});
db.operation.belongsTo(db.user, { foreignKey: 'userId' });
db.operation.belongsTo(db.tool, { foreignKey: 'toolId' });
db.operation.belongsTo(db.project, { foreignKey: 'projectId' });

db.tool.hasMany(db.usage, {as: 'usages'});
db.project.hasMany(db.usage, {as: 'usages'});
db.usage.belongsTo(db.tool, { foreignKey: 'toolId' });
db.usage.belongsTo(db.project, { foreignKey: 'projectId' });

db.user.hasMany(db.report, {as: 'reports'});
db.tool.hasMany(db.report, {as: 'reports'});
db.project.hasMany(db.report, {as: 'reports'});
db.report.belongsTo(db.user, { foreignKey: 'isOperatorApproved' });
db.report.belongsTo(db.user, { foreignKey: 'isOfficerApproved' });
db.report.belongsTo(db.user, { foreignKey: 'isSiteManagerApproved' });
db.report.belongsTo(db.user, { foreignKey: 'isProjectManagerApproved' });
db.report.belongsTo(db.tool, { foreignKey: 'toolId' });
db.report.belongsTo(db.project, { foreignKey: 'projectId' });

db.tool.hasMany(db.maintenance, {as: 'maintenances'});
db.project.hasMany(db.maintenance, {as: 'maintenances'});
db.maintenance.belongsTo(db.tool, { foreignKey: 'toolId' });
db.maintenance.belongsTo(db.project, { foreignKey: 'projectId' });

// db.user.belongsToMany(db.report, {
//   through: 'approval',
//   as: 'reports',
//   foreignKey: 'reportId',
// });
// db.tutorial.belongsToMany(db.tag, {
//   through: 'approval',
//   as: 'users',
//   foreignKey: 'userId',
// });

module.exports = db;
