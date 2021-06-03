const db = require('../models');
const Op = db.Sequelize.Op;

const Management = db.management;
const Project = db.project;
const Tool = db.tool;
const User = db.user;

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

  Management.findAll({
    where :{
      [Op.and]: [ {date}, {userId}, {toolId}, {projectId} ]
    },
    include: [
      { model: Tool, attributes: ['name'] },
      { model: User, attributes: ['name'] },
      { model: Project, attributes: ['name'] }
    ]
  })
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the operation'
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
    }
  })
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the management'
      });
    });
};