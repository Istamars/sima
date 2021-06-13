const db = require('../models');
const {v4: uuidv4} = require('uuid');

const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const Mechanic = db.mechanic;

exports.create = (req, res) => {
  const {name} = req.body;
  const id = uuidv4();
  const mechanic = {id, name}

  Mechanic.create(mechanic)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the mechanic'
      });
    });
}

exports.findAll = (req, res) => {
  Mechanic.findAll()
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving the mechanic'
      });
    });
}