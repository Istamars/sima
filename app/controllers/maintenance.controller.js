const db = require('../models');

const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const Maintenance = db.maintenance;

const changeMaintenanceFormat = (array) => {
    return array.map((item) => {
      const {
        startDate,
        endDate,
        type,
        description,
        quantity,
        unitPrice,
        total
      } = item;
      
      return {
        startDate,
        endDate,
        type,
        description,
        quantity,
        unitPrice,
        total
      }
    })
  }

exports.create = (req, res) => {
  const maintenance = {
    startDate,
    endDate,
    type,
    description,
    quantity,
    unitPrice,
    mechanicId,
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
        m."startDate",
        m."endDate",
        m.type,
        m.description,
        m.quantity,
        m."unitPrice",
        m."unitPrice" * m.quantity AS total,
        mc.name AS "mechanicName",
        t.name AS "toolName",
        p.name AS "projectName"
      FROM
        maintenances m, tools t, projects p, mechanics mc
      WHERE
        m."startDate" = :startDate AND
        m."endDate" = :endDate AND
        m."toolId" = :toolId AND
        m."projectId" = :projectId AND
        p.id = m."projectId" AND
        t.id = m."toolId" AND
        mc.id = m."mechanicId"
      GROUP BY
        m."startDate",
        m."endDate",
        m.type,
        m.description,
        m.quantity,
        m."unitPrice",
        t.name,
        p.name,
        mc.name`,
      {replacements: {projectId, toolId, startDate, endDate}}
    )
      .then(result=> {
        const data = {
          projectName: result[0][0].projectName,
          toolName: result[0][0].toolName,
          mechanicName: result[0][0].mechanicName,
          maintenance: changeMaintenanceFormat(result[0])
        }
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message
        });
      });
}

exports.getMaintenanceByProjectAndTool = (req, res) => {
    const {projectId, toolId} = req.params;

    sequelize.query(
      `SELECT
        m."startDate",
        m."endDate",
        m.type,
        m.description,
        m.quantity,
        m."unitPrice",
        m."unitPrice" * m.quantity AS total,
        mc.name AS "mechanicName",
        t.name AS "toolName",
        p.name AS "projectName"
      FROM
        maintenances m, tools t, projects p, mechanics mc
      WHERE
        m."toolId" = :toolId AND
        m."projectId" = :projectId AND
        p.id = m."projectId" AND
        t.id = m."toolId" AND
        mc.id = m."mechanicId"
      GROUP BY
        m."startDate",
        m."endDate",
        m.type,
        m.description,
        m.quantity,
        m."unitPrice",
        t.name,
        p.name,
        mc.name`,
        {replacements: {projectId, toolId}}
    )
      .then(result=> {
        const data = {
          projectName: result[0][0].projectName,
          toolName: result[0][0].toolName,
          mechanicName: result[0][0].mechanicName,
          maintenance: changeMaintenanceFormat(result[0])
        }
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}