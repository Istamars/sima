const db = require('../models');
const Op = db.Sequelize.Op;

const Operation = db.operation;
const Project = db.project;
const Tool = db.tool;
const User = db.user;

const changeOperationFormat = (array) => {
  return array.map((item) => {
    const {
      date,
      startTime,
      endTime,
      category,
      productionResult,
      unit,
      info,
      userId,
      toolId,
      projectId
    } = item;
    const duration = countDuration(startTime, endTime);
    const toolName = item.tool.name;
    const userName = item.user.name;
    const projectName = item.project.name;
    
    return {
      date,
      startTime,
      endTime,
      category,
      productionResult,
      duration,
      unit,
      info,
      userId,
      toolId,
      projectId,
      toolName,
      userName,
      projectName
    }
  })
}

const countDuration = (startTime, endTime) => {
  const start = startTime.split(':');
  const end = endTime.split(':');
  const duration = ((parseInt(end[0]) * 60) + parseInt(end[1])) - ((parseInt(start[0]) * 60) + parseInt(start[1]));
  const hour = Math.floor(duration/60);
  const minutes = (duration / 60) - hour;

  return hour ? `${hour} hour ${minutes} minutes` : `${minutes} minutes`;
}

exports.create = (req, res) => {
  const date = new Date(Date.now());
  const startTime = `${date.getHours()}:${date.getMinutes()}`;
  const {category, userId, toolId, projectId} = req.body;
  const operation = {date, startTime, category, userId, toolId, projectId}

  Operation.create(operation)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the operation'
      });
    });
}

exports.findAll = (req, res) => {
  const {date, userId, toolId, projectId} = req.params;

  Operation.findAll({
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
      const result = changeOperationFormat(data);
      return res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the operation'
      });
    });
}

exports.update = (req, res) => {
  const now = new Date(Date.now());
  const endTime = `${now.getHours()}:${now.getMinutes()}`;
  const {date, category, userId, toolId, projectId, productionResult, unit, info} = req.body;
  const operation = {endTime, productionResult, unit, info};

  Operation.update(operation, {
    where :{
      [Op.and]: [
        {date},
        {category},
        {userId},
        {toolId},
        {projectId}
      ]
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
          err.message || 'Some error occurred while creating the operation'
      });
    });
}
