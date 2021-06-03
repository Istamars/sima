const db = require('../models');
const {v4: uuidv4} = require('uuid');

const Operational = db.operational;

exports.create = (req, res) => {
  const {description, unit} = req.body;
  const id = uuidv4();

  if(!description)
    return res.status(400).send({ message: 'Description is required' });

  if(!unit)
    return res.status(400).send({ message: 'Unit is required' });

  const operational = {id, description, unit}
  Operational.create(operational)
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
  Operational.findAll()
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