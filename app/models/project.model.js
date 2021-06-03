module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define('project', {
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

  return Project;
};