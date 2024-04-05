
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
const { rmSync } = require('fs');

app.use(express.static(__dirname + '/'));

//ExpressHandlebars instance creation and configuration
const hbs = handlebars.create({
	extname: 'hbs',
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
});
//handlebars registering
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());

//Session init
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: true,
		reSave:	true,
	})
);
//Enable urlencoding for rich data from requests
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// -------------------------------------  DB CONFIG AND CONNECT   ---------------------------------------
const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
const db = pgp(dbConfig);

// db test
db.connect()
  .then(obj => {
    // Can check the server version here (pg-promise v10.1.0+):
    console.log('Database connection successful');
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR', error.message || error);
  });
//Copied from Lab 7

const user = {
	username: undefined,
	password: undefined
};

/*
---------------------------------
Register Routes
---------------------------------
*/

app.get("/", function (req, res) {
    res.redirect('/register');
});

app.get('/register', function (req, res) {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (userName,passWordHash) VALUES ($1,$2)`;

    try {
        await db.any(query, [req.body.username, hash])
        res.render('pages/login');
    }
    catch (err) {
        res.redirect("/register");
        console.log(err);
    }
});


/*
---------------------------------
Login Routes
---------------------------------
*/

app.get('/login', async (req, res) => {
    res.render('pages/login');
})

//More Original Code

app.post('/login', async (req,res)=>{
	const inputUsername = req.body.username;
	const query = `select * from users where users.userName = '${inputUsername}' LIMIT 1`;
	
	await db.one(query)
		.then(async data => {
			console.log(data);
			if(data.username == "")
			{
				res.redirect('/register');
			}
			user.username = data.username;
        	user.password = data.passwordhash;
			//No clue why bcrypt is returning false when I believe everything should be correct????????
			const match = await bcrypt.compare(req.body.password, user.password);
			console.log(match);
			if( match ) {
				req.session.user = user;
				req.session.save();
				res.redirect('/home');
			} else {
				res.render('pages/login',{
					error: true,
					message: 'Incorrect username or password.',
				});
			}

		})
	.catch(err => {
		console.log(err);
		res.redirect('/register');
	});
	console.log(req.body.password);
	console.log(user.password);

	/*This was moved inside code above.
	const match = await bcrypt.compare(req.body.password, user.password);
	if( match ) {
		req.session.user = user;
		req.session.save();
		res.redirect('/home');
	} else {
		res.render('pages/login',{
			error: true,
			message: 'Incorrect username or password.',
		});
	}
	*/
});



//More butchered up code
/*
app.post('/login', async (req, res) => {
	const inputUsername = req.body.username;
	const query = `select * from users where users.userName = '${inputUsername}' LIMIT 1`;
	//const values = [username];

	//Removed "const pass" due to it causing the db.one to not be called
	console.log("Before db.one");
	await db.one(query)
		.then(data => {
			console.log(data);
			console.log("GGGGGGGGGGGGG");
			if(data.username == "")
			{
				res.redirect('/register');
			}
			user.username = data.username;
        	user.password = data.passwordhash;
			//return data.passWordHash;
		})
		.catch(error => {
			console.log("err");
			res.redirect('/register');
			return;
		});
	console.log("EEEEEEEE");
	console.log(req.body.password);
	console.log(user.password);
	const match = await bcrypt.compare(req.body.password, user.password);
	console.log("after bcrypt");
	console.log(match);
	if(match === true) {
		//user.username = username;
		//user.password = pass;
		req.session.user = user;
		req.session.save();
		res.redirect('/home');
	} else {
		res.render('pages/login',{
			error: true,
			message: 'Incorrect username or password.',
		});
	}
});
*/

//Code I took exactly from lab-8 where it worked, yet doesn't here. 
/*
app.post('/login', async (req,res) => {
    const inputUser = req.body.username;
    const userQuery = `SELECT * FROM users WHERE username = '${inputUser}' LIMIT 1`;

    db.one(userQuery)
      .then(async data => {
        //console.log("Data is found");
        if(data.username == "")
        {
          //console.log("User not found");
          res.redirect('/register');
        }
        //console.log("Made it past first if");
        user.username = data.username;
        user.password = data.passwordhash;
        //console.log("Made it past setting user");
        // check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);
        console.log(match);
        if(match === true)
        {
          //console.log("match == true");
          req.session.user = user;
          req.session.save();
          res.redirect('/home');
        }
        else 
        {
          //console.log("match == false");
          //res.message("Incorrect username or password");
          res.render('pages/login', {
            message: `Incorrect username or password`
          });
          //res.message("Incorrect username or password.");
        }
        //console.log("Made it past all ifs");
      })
      .catch(error =>{
        console.log("it broke");
      });
	});
	*/


app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');//? is this Still true