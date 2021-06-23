const db = require('../models');
const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

const Management = db.management;

const isEmpty = (obj) => {
  if(!obj) return true;
  if(!Object.keys(obj).length) return true;
  else return false
}

exports.create = (req, res) => {
  const management = {
    location,
    job,
    initialHm,
    userId,
    toolId,
    projectId
  } = req.body;
  const date = new Date(Date.now())
  management.date = date;
 
  Management.findOne({
    where :{
      [Op.and]: [
        {date},
        {userId},
        {toolId},
        {projectId}
      ]
    }
  })
    .then(data => {
      if(isEmpty(data)) {
        Management.create(management)
          .then(data => {
            return res.status(200).send(data);
          })
          .catch(err => {
            return res.status(500).send({
              message:
                err.message || 'Some error occurred while creating the management'
            });
          });
      } else {
        return res.status(500).send({
          message: 'Cannout craete management due to already create'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the management'
      });
    });
};

exports.findAll = (req, res) => {
  const {date, userId, toolId, projectId} = req.params;

  sequelize.query(
    `SELECT
      m.*,
      p."name" as "projectName",
      t."name" as "toolName",
      u."name" as "userName",
      (SELECT
          SUM(o."productionResult")
        FROM
          operations o
        WHERE 
          o."userId" = :userId AND
          o."toolId" = :toolId AND
          o."projectId" = :projectId AND
          o.date = :date) as "productionResult"
      FROM
        management m, projects p, tools t, users u
      WHERE
        m."date" = :date AND
        m."userId" = :userId AND
        m."toolId" = :toolId AND
        m."projectId" = :projectId AND
        u.id = m."userId" AND
        t.id = m."toolId" AND
        p.id = m."projectId"
      GROUP BY
        m.date,
        m."isCleaned",
        m."cleanlinessNote",
        m."isReady",
        m."readyNote",
        m.location,
        m.job,
        m."returnTime",
        m."feeHour",
        m."feeKg",
        m."initialHm",
        m."finalHm",
        m."userId",
        m."toolId",
        m."projectId",
        p.name,
        t.name,
        u.name`,
    {replacements: {date, userId, toolId, projectId}}
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

exports.update = (req, res) => {
  const management = {
    isCleaned,
    cleanlinessNote,
    isReady,
    readyNote,
    returnTime,
    finalHm,
  } = req.body;
  const {date, userId, toolId, projectId} = req.body;

  Management.update(management, {
    where :{
      [Op.and]: [ {date}, {userId}, {toolId}, {projectId} ]
    },
    returning: true,
  })
    .then(result => {
      if (result[0] !== 1)
        return res.status(500).send({message: 'Operation changes failed'});
      const data = result[1][0].dataValues;
      return res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the management'
      });
    });
};

exports.addFee = (req, res) => {
  const management = { feeHour, feeKg } = req.body;
  const {date, userId, toolId, projectId} = req.body;

  Management.update(management, {
    where :{
      [Op.and]: [ {date}, {userId}, {toolId}, {projectId} ]
    },
    returning: true,
  })
    .then(result => {
      if (result[0] !== 1)
        return res.status(500).send({message: 'Operation changes failed'});
      const data = result[1][0].dataValues;
      return res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the management'
      });
    });
};