// ********************** Initialize server **********************************

const server = require('../src'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************
/*
describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});
*/ //Not needed for turn in, but good to have as an example
// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************





  describe('Testing Register API', () => {
    it('positive : /register', done => {
      // Refer above for the positive testcase implementation
      chai
      .request(server)
      .post('/register')
      .send({ 
        userName: 'johndoe', 
        passWordHash: 'hashedPassword'
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.render.calledOnce).to.be.true;
        done();
      });
    });
  

    it('Negative : /register. Checking no username', done => {
      chai
        .request(server)
        .post('/register')
        .send({
           //Providing no username. Should fail if no username is passed in
           passWordHash: 'hashedPassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          //expect(res.redirect.CalledOnce).to.be.true;
          done();
        });
    });
  });


  //////////////////////////////////////////////////////
  //               /login API Tests                   //
  //////////////////////////////////////////////////////
  describe('Testing Login API', () => {
    it('positive : /register', done => {
      // Refer above for the positive testcase implementation
      chai
      .request(server)
      .post('/login')
      .send({ 
        userName: 'johndoe', 
        passWordHash: 'hashedPassword'
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.render.calledOnce).to.be.true;
        done();
      });
    });
  



    it('Negative : /login. Checking no username', done => {
      chai
        .request(server)
        .post('/login')
        .send({
           //Providing no username
           //username: '',  //Should fail if no username is passed in
           passWordHash: 'hashedPassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          //expect(res.redirect.CalledOnce).to.be.true;
          done();
        });
    });
  });
    