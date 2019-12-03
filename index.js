// implement your API here

const express = require('express');
const db = require('./data/db.js');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.send({ api: 'up and running' });
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.send(users);
    })
    .catch(error => {
      console.log('error on GET /hubs', error);
      res.status(500).json({ errorMessage: 'error getting user from database' });
    });
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'This user ID do not exist' });
      } else {
        res.json(user);
      }
    })
    .catch(error => {
      res.status(400).json({ error: 'The users description is unavailable at this time. sorry bout it' });
    });
});

server.post('/api/users', (req, res) => {
  const userDescription = req.body;
  if (!userDescription.name || !userDescription.bio) {
    res.status(400).json({ error: 'Please enter a name and bio for this user.' });
  } else {
    db.insert(userDescription)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => {
        res.json({ error: 'The user has not been added! Try again..' });
      });
  }
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id).then(user => {
    if (!user) {
      res.status(404).json({ error: "That user ID doesn't actually exist my friend... " });
    } else {
      db.remove(id)
        .then(hub => {
          res.status(201).json(hub);
        })
        .catch(error => {
          res.status(500).json({ error: 'There was an error deleting the user' });
        });
    }
  });
});

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const change = req.body;
  db.findById(id).then(user => {
    if (!user) {
      res.status(404).json({ message: "That user ID doesn't exist on this server" });
    } else if (!change.name || !change.bio) {
      res.status(400).json({ error: 'Plesae enter a user name and bio' });
    } else {
      db.update(id, modify)
        .then(hub => {
          res.status(200).json(hub);
        })
        .catch(error => {
          res.status(500).json({ message: 'That user was not changed...' });
        });
    }
  });
});

const port = 4000;
server.listen(port, () => console.log(`\n ** API running on port ${port} **\n`));
