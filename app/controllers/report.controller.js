const db = require('../models');

const Report = db.report;
const sequelize = db.sequelize;

exports.create = (req, res) => {
  const report = {
    type,
    dateOrMonthOrYear,
    projectId,
    toolId,
    isOperatorApproved,
    isOfficerApproved,
    isSiteManagerApproved,
    isProjectManagerApproved,
    userId
  } = req.body;
  report.createdAt = new Date(Date.now());
  report.status = 'draft';

  Report.create(report)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the report'
      });
    });
}

exports.findDraft = (req, res) => {
  Report.findAll({where: {status: 'draft'}})
    .then(data => {
        console.log(data)
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the operation'
      });
    });
}

exports.findApprove = (req, res) => {
  Report.findAll({where: {status: 'approve'}})
    .then(data => {
        console.log(data)
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the operation'
      });
    });
}

exports.findDailyReport = (req, res) => {
    const {dateOrMonthOrYear, userId, createdAt, projectId, toolId} = req.params;
    const type = 'daily';

    sequelize.query(
      `SELECT 
        r.*,
        t.name AS "toolName",
        p.name AS "projectName",
        u.name AS "userName",
        m.location,
        m.job,
        m."initialHm",
        m."finalHm"
      FROM
        reports r, projects p, tools t, management m, users u
      WHERE
        r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
        r."userId" = :userId AND
        r.type = :type AND
        r."createdAt" = :createdAt AND
        r."projectId" = :projectId AND
        r."toolId" = :toolId AND
        m.date = :dateOrMonthOrYear AND
        p.id = r."projectId" AND
        t.id = r."toolId" AND
        u.id = r."userId" AND
        m."projectId" = r."projectId" AND
        m."toolId" = r."toolId" AND
        m."userId" = r."userId"
      GROUP BY
        r."createdAt",
        r.type,
        r."dateOrMonthOrYear",
        r.status,
        r."projectId",
        r."toolId",
        r."isOfficerApproved",
        r."isOperatorApproved",
        r."isProjectManagerApproved",
        r."isSiteManagerApproved",
        r."userId",
        u.name,
        t.name,
        p.name,
        m.location,
        m.job,
        m."initialHm",
        m."finalHm"`,
      {replacements: {dateOrMonthOrYear, userId, type, createdAt, projectId, toolId}}
    )
      .then(result=> {
        const data = result[0][0];
        const {dateOrMonthOrYear, userId, toolId, projectId} = data;

        sequelize.query(
            `SELECT * FROM operations o WHERE o.date = :dateOrMonthOrYear AND o."userId" = :userId AND o."toolId" = :toolId AND o."projectId" = :projectId`,
            {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
          )
          .then(result=> {
            const operations = result[0];
            data.operations = operations;

            sequelize.query(
                `SELECT
                  c.*,
                  c.quantity * c."unitCost" AS total,
                  o.description,
                  o.unit
                FROM
                  costs c, operationals o
                WHERE
                  c.date = :dateOrMonthOrYear AND
                  c."userId" = :userId AND
                  c."toolId" = :toolId AND
                  c."projectId" = :projectId AND
                  o.id = c."operationalId"`,
                {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
              )
              .then(result=> {
                const costs = result[0];
                data.costs = costs;
                sequelize.query(
                    `SELECT * FROM management m WHERE m.date = :dateOrMonthOrYear AND m."userId" = :userId AND m."toolId" = :toolId AND m."projectId" = :projectId`,
                    {replacements: {dateOrMonthOrYear, userId, toolId, projectId}}
                  )
                  .then(result=> {
                    const management = result[0][0];
                    data.management = management;
                    return res.status(200).send(data);
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message || 'Some error occurred while creating the cost'
                    });
                  });
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message || 'Some error occurred while creating the cost'
                });
              });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || 'Some error occurred while creating the cost'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}

exports.findMonthlyReport = (req, res) => {
    const {dateOrMonthOrYear, userId, createdAt, projectId, toolId} = req.params;
    const type = 'monthly';
    const year = dateOrMonthOrYear.split('-')[0];
    const month = dateOrMonthOrYear.split('-')[1];

    sequelize.query(
      `SELECT 
        r.*,
        t.name AS "toolName",
        p.name AS "projectName",
        u.name AS "userName",
        MIN(m."initialHm") AS "initialHm",
        MAX(m."finalHm") AS "finalHm"
      FROM
        reports r, projects p, tools t, users u, management m
      WHERE
        r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
        r."userId" = :userId AND
        r.type = :type AND
        r."createdAt" = :createdAt AND
        r."projectId" = :projectId AND
        r."toolId" = :toolId AND
        EXTRACT(MONTH FROM m.date) = :month AND
        EXTRACT(YEAR FROM m.date) = :year AND
        m."projectId" = :projectId AND
        m."toolId" = :toolId AND
        p.id = r."projectId" AND
        t.id = r."toolId" AND
        u.id = r."userId"
      GROUP BY
        r."createdAt",
        r.type,
        r."dateOrMonthOrYear",
        r.status,
        r."projectId",
        r."toolId",
        r."isOfficerApproved",
        r."isOperatorApproved",
        r."isProjectManagerApproved",
        r."isSiteManagerApproved",
        r."userId",
        u.name,
        t.name,
        p.name`,
      {replacements: {year, month, dateOrMonthOrYear, userId, type, createdAt, projectId, toolId}}
    )
      .then(result=> {
        //   console.log(result)
        //   return res.send(result)
        const data = result[0][0];

        if(!data) return res.status(200).send(data);

        const {userId, toolId, projectId} = data;

        sequelize.query(
            `SELECT
              *
            FROM
              operations o
            WHERE 
              EXTRACT(MONTH FROM o.date) = :month AND
              EXTRACT(YEAR FROM o.date) = :year AND
              o."toolId" = :toolId AND
              o."projectId" = :projectId
            ORDER BY
              o.date ASC`,
            {replacements: {year, month, userId, toolId, projectId}}
          )
          .then(result=> {
            const operations = result[0];
            data.operations = operations;

            return res.status(200).send(data);

          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || 'Some error occurred while creating the cost'
            });
          });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the cost'
        });
      });
}
