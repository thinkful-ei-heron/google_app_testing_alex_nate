/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const store = require('./store.js');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  let filtered = [...store];

  let reviewMin = 0;
  const validSortTypes = ['Rating', 'App', 'Lastupdated'];
  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  let filter = '';
  let sort = '';
  
  if(req.query.minreviews) {
    reviewMin = req.query.minreviews;
  }

  filtered = filtered.filter(app => parseInt(app.Reviews) > reviewMin);

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
    return res.status(400).send('Sort must be either rating, app, or lastupdated');
  }
  const dateConversion = function(date) {
    let reformDate = date.replace(/,/g, '');
    reformDate = reformDate.split(' ');
    let temp = reformDate[2];
    reformDate[2] = reformDate[0];
    reformDate[0] = temp;
    return Date.parse(reformDate.join('-'));
  };
  if(sort === 'Lastupdated') {
    filtered = filtered.sort((a, b) => dateConversion(a['Last Updated']) < dateConversion(b['Last Updated']) ? 1 : -1);
  }
  if(sort === 'App') {
    filtered = filtered.sort((a, b) => a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : -1);
  }

  
  if(sort === 'Rating') {
    filtered = filtered.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
  }

  res.json(filtered);
});



module.exports = app;