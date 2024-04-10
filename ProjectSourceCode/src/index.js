
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
			if(data.username == "")
			{
				res.redirect('/register');
			}
			user.username = data.username;
        	user.password = data.passwordhash;
			//Turns out the SQL table had to have the password as char(60) exactly in order to work.
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

		})
	.catch(err => {
		console.log(err);
		res.redirect('/register');
	});


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

// Authentication Middleware.
const auth = (req, res, next) => {
	if (!req.session.user) {
	  // Default to login page.
	  return res.redirect('/login');
	}
	next();
  };
  
  // Authentication Required
  app.use(auth);

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

// This route handles GET requests to the '/home' endpoint.
app.get('/home', (req, res) => {
	// Render the 'home' template
	res.render('pages/home');
  });

// This route handles GET requests to the '/logout' endpoint.
app.get('/logout', (req, res) => {
	req.session.destroy();
	res.render('pages/logout');
  });

app.post('/home', async (req, res) => {
    const { event, date, time, location, description } = req.body;

    try {
        const query = `INSERT INTO todo (eventDate, eventTime, eventTitle, eventDesc, eventLocation) VALUES ($1, $2, $3, $4, $5)`;
        await db.none(query, [date, time, event, description, location]);

        res.redirect('/home');
    } catch (error) {
        console.log('Error creating a newtodo:', error);
    }
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');//? is this Still true