const db = require('../models');

const Report = db.report;

exports.create = (req, res) => {
  const report = {
    type,
    dateOrMonth,
    projectId,
    toolId,
    isOperatorApproved,
    isOfficerApproved,
    isSiteManagerApproved,
    isProjectManagerApproved
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
