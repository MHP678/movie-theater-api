const express = require('express');
const { User } = require('./models/user');

const app = express();

// get all users
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// get one user by id
app.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// get all shows watched by a user (user id in req.params)
app.get('/users/:id/shows', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    const shows = await user.getShows();
    res.json(shows);
  } else {
    res.status(404).send('User not found');
  }
});

// update and add a show if a user has watched it
app.put('/users/:id/shows/:showId', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    const [show, created] = await user.addShow(req.params.showId, {
      through: { status: req.body.status, rating: req.body.rating },
    });
    res.json(show);
  } else {
    res.status(404).send('User not found');
  }
});

// start server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
