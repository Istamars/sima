const db = require('../models');
const {v4: uuidv4} = require('uuid');

const Tool = db.tool;

exports.create = (req, res) => {
  const {name} = req.body;
  const id = uuidv4();

  if(!name)
    return res.status(400).send({ message: 'Name is required' });

  const tool = {id, name}
  Tool.create(tool)
    .then(data => {
      return res.status(200).send({id, name});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while adding the tool'
      });
    });
};

exports.findAll = (req, res) => {
  Tool.findAll()
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
