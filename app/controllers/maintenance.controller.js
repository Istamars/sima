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
        mechanicName,
        total
      } = item;
      
      return {
        startDate,
        endDate,
        type,
        description,
        quantity,
        unitPrice,
        mechanicName,
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
        p.name AS "projectName",
        (SELECT
          MIN(mg."initialHm")
        FROM
          management mg, maintenances m
        WHERE
          m."projectId" = :projectId AND
          m."toolId" = :toolId AND
          m."startDate" = :startDate AND
          m."projectId" = mg."projectId" AND
          m."toolId" = mg."toolId" AND
          m."startDate" = mg.date) as "initialHm",
        (SELECT
          MAX(mg."finalHm")
        FROM
          management mg, maintenances m
        WHERE
          m."projectId" = :projectId AND
          m."toolId" = :toolId AND
          m."endDate" = :endDate AND
          m."projectId" = mg."projectId" AND
          m."toolId" = mg."toolId" AND
          m."endDate" = mg.date) as "finalHm"
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
          initialHm: result[0][0].initialHm,
          finalHm: result[0][0].finalHm,
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
        u.mobilization,
        u.demobilization,
        mc.name AS "mechanicName",
        t.name AS "toolName",
        p.name AS "projectName",
        (SELECT
          MIN(mg."initialHm")
        FROM
          management mg, maintenances m
        WHERE
          m."projectId" = :projectId AND
          m."toolId" = :toolId AND
          m."projectId" = mg."projectId" AND
          m."toolId" = mg."toolId" AND
          m."startDate" = mg.date) as "initialHm",
        (SELECT
          MAX(mg."finalHm")
        FROM
          management mg, maintenances m
        WHERE
          m."projectId" = :projectId AND
          m."toolId" = :toolId AND
          m."projectId" = mg."projectId" AND
          m."toolId" = mg."toolId" AND
          m."endDate" = mg.date) as "finalHm"
      FROM
        maintenances m, tools t, projects p, mechanics mc, usages u
      WHERE
        m."toolId" = :toolId AND
        m."projectId" = :projectId AND
        p.id = m."projectId" AND
        t.id = m."toolId" AND
        u."projectId" = m."projectId" AND
        u."toolId" = m."toolId" AND
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
        mc.name,
        u.mobilization,
        u.demobilization`,
        {replacements: {projectId, toolId}}
    )
      .then(result=> {
        const data = {
          projectName: result[0][0].projectName,
          toolName: result[0][0].toolName,
          mechanicName: result[0][0].mechanicName,
          initialHm: result[0][0].initialHm,
          finalHm: result[0][0].finalHm,
          mobilization: result[0][0].mobilization,
          demobilization: result[0][0].demobilization,
          projectId,
          toolId,
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