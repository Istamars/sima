const db = require('../models');

const Report = db.report;
const sequelize = db.sequelize;

exports.create = (req, res) => {
  const report = {
    type,
    dateOrMonth,
    projectId,
    toolId,
    isOperatorApproved,
    isOfficerApproved,
    isSiteManagerApproved,
    isProjectManagerApproved,
    userId
  } = req.body;
  report.createdAt = new Date(Date.now());

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

exports.findDailyReport = (req, res) => {
    const {dateOrMonthOrYear, userId, type, createdAt} = req.params;

    sequelize.query(
        `SELECT 
          r.*,
          t.name AS "toolName",
          p.name AS "projectName",
          m."locatuion",
          m.job,
          m."initialHm",
          m."finalHm"
        FROM
          reports r, projects p, tools t, management m
        WHERE
          r."dateOrMonthOrYear" = :dateOrMonthOrYear AND
          r."userId" = :userId AND
          r.type = :type AND
          r."createdAt" = :createdAt AND
          p.id = r."projectId" AND
          t.id = r.type AND
          r.type = :type AND
          r.type = :type AND
          r.type = :type AND
          `,
          {replacements: {dateOrMonthOrYear, userId, type, createdAt}}
      )
        .then(result=> {
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
