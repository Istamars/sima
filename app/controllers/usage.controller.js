const db = require('../models');
const Op = db.Sequelize.Op;

const Usage = db.usage;

exports.create = (req,res) => {
  const usage = {
    mobilization,
    demobilization,
    toolId,
    projectId
  } = req.body;

  Usage.create(usage)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err || 'Some error occurred while creating the cost'
      });
    });
}

exports.findByProjectAndTool = (req, res) => {
  const {toolId, projectId} = req.params;
  Usage.findOne({
    where :{
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