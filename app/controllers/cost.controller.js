const db = require('../models');
const sequelize = db.sequelize;

const Op = db.Sequelize.Op;
const Cost = db.cost;

exports.create = (req, res) => {
  const cost = {
    unitCost,
    quantity,
    userId,
    toolId,
    projectId,
    operationalId
  } = req.body;
  cost.date = new Date(Date.now());

  Cost.create(cost)
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

exports.findAllByMonth = (req, res) => {
  const {month, year, toolId, projectId} = req.params;

  sequelize.query(
    `SELECT
      c.*, p."name" as "projectName", t."name" as "toolName"
    FROM
      costs c, projects p, tools t 
    WHERE
      EXTRACT(MONTH FROM date) = :month AND
      EXTRACT(YEAR FROM date) = :year AND
      c."toolId" = :toolId AND
      c."projectId" = :projectId AND
      t.id = c."toolId" AND
      p.id = c."projectId"
    ORDER BY
      c.date ASC`,
    {replacements: {month, year, toolId, projectId}}
  )
    .then(result => {
      const data = result[0];
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the cost'
      });
    });
}

exports.findTotalCostByOperational = (req, res) => {
  const {month, year, toolId, projectId} = req.params;

  sequelize.query(
    `SELECT
      o.description,
      SUM(c."unitCost" * c.quantity) AS "total",
      p."name" AS "projectName",
      t."name" AS "toolName"
    FROM
      costs c, operationals o, projects p, tools t
    WHERE
      EXTRACT(MONTH FROM c.date) = :month AND 
      EXTRACT(YEAR FROM c.date) = :year AND 
      c."toolId" = :toolId AND
      c."projectId" = :projectId AND
      c."operationalId" = o.id AND 
      c."toolId" = t.id AND
      c."projectId" = p.id  
    GROUP BY
      c."operationalId",
      o.description,
      p."name",
      t."name"`,
    {replacements: {month, year, toolId, projectId}}
  )
    .then(result => {
      const data = result[0];
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the cost'
      });
    });
}

exports.findByProjectToolDate = (req, res) => {
    const {projectId, toolId, date} = req.params

    sequelize.query(
      `SELECT
        o.description, c.quantity, c."unitCost", c.quantity * c."unitCost" as "total"
      FROM
        costs c, operationals o
      WHERE
        c."projectId" = :projectId AND
        c."toolId" = :toolId AND
        c."date" = :date AND
        c."operationalId" = o.id`,
      {replacements: {date, toolId, projectId}}
    )
      .then(result => {
        const data = result[0];
        return res.status(200).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findAllByProject = (req, res) => {
  const {toolId, projectId} = req.params;

  Cost.findAll({ 
    where: {
      [Op.and]: [
        {toolId},
        {projectId}
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
