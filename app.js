/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const store = require('./store.js');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  let filtered = [...store];

  const validSortTypes = ['Rating', 'App'];
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  let filter = '';
  let sort = '';
  

  if(req.query.genres) {
    filter = req.query.genres.charAt(0).toUpperCase() + req.query.genres.slice(1);
  }

  if(req.query.sort) {
    sort = req.query.sort.charAt(0).toUpperCase() + req.query.sort.slice(1);
  }

  if (req.query.genres && (!validGenres.includes(filter))){
    return res.status(400).send(`Genre filter must be by ${validGenres.join(' ')}`);
  }

  if(filter) {
    filtered = filtered.filter(app => app.Genres.includes(filter));
  }
  


  

  if (req.query.sort && (!validSortTypes.includes(sort))) {
    return res.status(400).send('Sort must be either rating or app');
  }
  

  if(sort) {
    filtered = filtered.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
  }

  res.json(filtered);
});

app.listen(8000, () => {
  console.log('listening!');
});