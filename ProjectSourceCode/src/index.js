
//copied from lab8, note: ask if okay to copy the requires from lab8?
const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

app.use(express.static(__dirname + '/'));
















app.get("/", function (req, res) {
    res.redirect('/register');
});

app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (username,password) VALUES ($1,$2)`;

    try {
        await db.any(query, [req.body.username, hash])
        res.render('pages/login');
    }
    catch (err) {
        res.redirect("/register");
        console.log(err);
    }
});

app.get('/login', async (req, res) => {
    res.render('pages/login');
})
