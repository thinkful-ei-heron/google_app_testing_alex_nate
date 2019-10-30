const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

describe('GET /apps', () => {
  it('should return 400 if the genre filter is not correct', () => {
    const query = { genres: 'Book' };
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(400);
  });
  it('should return 400 if the sort is not by rating or app', () => {
    const query = { sort: 'Price' };
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(400, 'Sort must be either rating, app, or lastupdated');
  });
  it('should return an array of items', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });
  it('should return 2 items when filtered by puzzle genre', () => {
    const query = { genres: 'Puzzle'};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.length).to.eql(2);
      });
  });
  it('should sort by rating', () => {
    const query = { sort: 'rating'};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating >= res.body[i+1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
  it('should sort by app name', () => {
    const query = { sort: 'app'};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0, sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App.toLowerCase() < res.body[i+1].App.toLowerCase();
          i++; 
        }
        expect(sorted).to.be.true;
      });
  });
  it('should filter by action genre and sort by rating to return 6 apps', () => {
    const query = { genres: 'Action', sort: 'Rating'};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array'); 
        expect(res.body.length).to.eql(6);
        let i = 0, sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating >= res.body[i+1].Rating;
          i++;
        }
      });
  });
  it('should only show four apps when minimum number of views is set to 20 million', () => {
    const query = { minreviews: 20000000};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.eql(4);
      });
  });
  it('should sort by when it was last updated when that sort method is chosen', () => {
    const query = { sort: 'lastupdated'};
    return supertest(app)
      .get('/apps')
      .query(query)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        let i = 0, sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i]['Last Updated'] < res.body[i+1]['Last Updated'];
          i++; 
        }
      });
  });
});