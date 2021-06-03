const db = require('../models');
const {v4: uuidv4} = require('uuid');

const Project = db.project;

exports.create = (req, res) => {
  const {name} = req.body;
  const id = uuidv4();

  if(!name)
    return res.status(400).send({ message: 'Name is required' });

  const project = {id, name}
  Project.create(project)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the project'
      });
    });
}

exports.findAll = (req, res) => {
  Project.findAll()
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the tool'
      });
    });
}

exports.findById = (req, res) => {
  const {id} = req.params;

  Project.findOne({ where: { id }})
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the project'
      });
    });
}
