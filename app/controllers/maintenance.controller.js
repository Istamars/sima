const db = require('../models');

const sequelize = db.sequelize;
// const Op = db.Sequelize.Op;
const Maintenance = db.maintenance;

exports.create = (req, res) => {
  const maintenance = {
    startDate,
    endDate,
    type,
    mechanic,
    quantity,
    unitPrice,
    toolId,
    projectId
  } = req.body;

  Maintenance.create(maintenance)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the cost'
      });
    });
}

exports.getByDateRange = (req, res) => {
    const {projectId, toolId, startDate, endDate} = req.params;

    sequelize.query(
      `SELECT
        m.startDate,
        m.endDate,
        m.type,
        m.mechanic,
        m.quantity,
        m.unitPrice,
        m.unitPrice * m.quantity AS total
        t.name,
        p.name
      FROM
        maintenances m, tools t, projects p
      WHERE
        m."startDate" = :startDate AND
        m."endDate" = :endDate AND
        m."toolId" = :toolId AND
        m."projectId" = :projectId AND
        p.id = m."projectId" AND
        t.id = m."toolId"
      GROUP BY
        p.name, t.name`,
      {replacements: {projectId, toolId, startDate, endDate}}
    )
      .then(result=> {
        const data = result[0];
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving the maintenances'
        });
      });
}

exports.getMaintenanceByProjectAndTool = (req, res) => {
    const {projectId, toolId} = req.params;

    Maintenance.findAll({
      where: {
        [Op.and]: [
          {projectId},
          {toolId}
        ]
      }
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}