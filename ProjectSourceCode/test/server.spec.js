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

//We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 400 along with a "Invalid input" message.

  // Example Negative Testcase :
  // API: /add_user
  // Input: {id: 5, name: 10, dob: '2020-02-20'}
  // Expect: res.status == 400 and res.body.message == 'Invalid input'
  // Result: This test case should pass and return a status 400 along with a "Invalid input" message.
  // Explanation: The testcase will call the /add_user API with the following invalid inputs
  // and expects the API to return a status of 400 along with the "Invalid input" message.

  describe('Testing Register API', () => {
    it('positive : /register', done => {
      // Refer above for the positive testcase implementation
      chai
      .request(server)
      .post('/register')
      .send({ 
        username: 'johndoe', 
        passwordhash: 'hashedPassword',
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.render.calledOnce).to.be.true;
        done();
      });
    });
  
    // Example Negative Testcase :
    // API: /add_user
    // Input: {id: 5, name: 10, dob: '2020-02-20'}
    // Expect: res.status == 400 and res.body.message == 'Invalid input'
    // Result: This test case should pass and redirect back to the register page.
    // Explanation: The testcase will call the /add_user API with the following invalid inputs
    // and expects the API to return a status of 400 along with the "Invalid input" message.
    it('Negative : /register. Checking invalid name', done => {
      chai
        .request(server)
        .post('/register')
        .send({
           //Providing no username
          passwordhash: 'hashedPassword',
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
        username: 'johndoe', 
        passwordhash: 'hashedPassword',
        })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.render.calledOnce).to.be.true;
        done();
      });
    });
  



    it('Negative : /login. Checking invalid name', done => {
      chai
        .request(server)
        .post('/login')
        .send({
           //Providing no username
           username: '',
          passwordhash: 'hashedPassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          //expect(res.redirect.CalledOnce).to.be.true;
          done();
        });
    });
  });
    