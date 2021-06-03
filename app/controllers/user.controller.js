const db = require('../models');
const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const User = db.user;

exports.login = (req, res) => {
  const {name, password} = req.body;

  User.findOne({ where: {name}})
    .then(data => {
      bcrypt.compare(password, data.password, (err, result) => {
        if(err) return res.status(500).send({ message: 'Auth failed' });
        
        const {id, name, position} = data;
        if(result) {
          return res.status(200).send({id, name, position});
        }

        return res.status(500).send({ message: 'Invalid email or password' });
      })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving user'
      });
    });
}

exports.register = (req, res) => {
  const {name, password, position} = req.body;
  const id = uuidv4();

  if(!name)
    return res.status(400).send({ message: 'Name is required' });

  if(!password)
    return res.status(400).send({ message: 'Password is required' });

  bcrypt.hash(password, 10, (err, hash) => {
    if(err) return res.status(500).send({ message: err });

    const user = {id, name, password: hash, position};
    User.create(user)
      .then(data => {
        return res.status(200).send({id, name, position});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the Book.'
        });
      });
  });
};

exports.changePassword = (req, res) => {
  const {id, password} = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if(err) return res.status(500).send({ message: err });

    const user = {password: hash};

    User.update(user, { where: {id} })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Password was updated successfully."
          });
        } else {
          res.send({
            message: 'Password changes failed'
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while creating the Book.'
        });
      });
  });

  
}
