
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
		reSave: true,
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

let user = {
	username: undefined,
	password: undefined,
	firstName: undefined,
	lastName: undefined,
	idPref: undefined,
	id: undefined
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

	if (req.body.password === undefined || req.body.password === "") //Checks if no password was given.
	{
		//res.status(400);
		res.redirect(400, '/register');
		return;
	}
	if (req.body.username === undefined || req.body.username === "") //Checks if no username was given.
	{
		//res.status(400);
		res.redirect(400, '/register');
		return;
	}
	if (req.body.firstName === undefined || req.body.firstName === "") //Checks if no username was given.
	{
		//res.status(400);
		res.redirect(400, '/register');
		return;
	}
	if (req.body.lastName === undefined || req.body.lastName === "") //Checks if no username was given.
	{
		//res.status(400);
		res.redirect(400, '/register');
		return;
	}


	const hash = await bcrypt.hash(req.body.password, 10);
	const query = `INSERT INTO users (userName, firstName, lastName, passWordHash) VALUES ($1,$2, $3, $4)`;

	try {
		await db.any(query, [req.body.username, req.body.firstName, req.body.lastName, hash])
		res.status(200);
		res.render('pages/login'); //Need to redirect to login page since the register only adds data to database. Does not actually login and create session.

	}
	catch (err) {
		res.status(400);
		res.redirect('register');
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

app.post('/login', async (req, res) => {
	const inputUsername = req.body.username;
	const inputPass = req.body.password;
	if (!inputUsername || !inputPass) //Checks if blank username is received from user in HTML form.
	{
		//res.status(400);
		res.redirect(400, '/register');
		return;
	}

	const query = `select * from users where users.userName = '${inputUsername}' LIMIT 1`;


	await db.one(query)
		.then(async data => {
			if (data.username === "" || data.username === undefined) //Checks if blank username is received.
			{
				res.status(400);
				res.redirect('/register');
			}
			user.username = data.username;
			user.password = data.passwordhash;

			req.session.save();

			//Turns out the SQL table had to have the password as char(60) exactly in order to work.
			const match = await bcrypt.compare(req.body.password, user.password);
			if (match) {
				res.status(200);
				req.session.user = user;
				req.session.user.firstName = data.firstName;
				req.session.user.lastName = data.lastName;
				req.session.user.id = data.iduser;
				req.session.user = user; // Store user object in session
				req.session.save();
				res.redirect('/home');
			} else {
				res.status(400);
				res.render('pages/login', {
					error: true,
					message: 'Incorrect username or password.',
				});
			}

		})
		.catch(err => {
			res.status(400);
			console.log(err);
			res.redirect('/register');
		});
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
	res.json({ status: 'success', message: 'Welcome!' });
});

// This route handles GET requests to the '/home' endpoint.
app.get('/home', (req, res) => {
	// Render the 'home' template
	res.render('pages/home');
});

// This route handles GET requests to the '/todo' endpoint.
//Currently have the sorting system rendering the page at the end.
/*app.get('/todos', (req, res) => {
	// Render the 'TODOs' template
	res.render('partials/todos');
  });*/

// This route handles GET requests to the '/notes' endpoint.
app.get('/notes', (req, res) => {
	// Render the 'notes' template
	res.render('partials/notes');
});

// This route handles GET requests to the '/logout' endpoint.
app.get('/logout', (req, res) => {
	req.session.destroy();
	res.render('pages/logout');
});


//This route handles the GET requests for the sorting system.
//Goal is to receive a specific number, and reuturn all sorted todos based on the format of received number
//Only return todos which the IDtodo is matched with idUser in the users_to_todo table.
//Ex. Receives 1, so we sort with soonest todos on top, and farthest on the bottom. Want to pull form table and return list to be displayed onto site.
app.get('/todos', async (req, res) => {
	if (req.session.user.idPref == 2) {
		console.log("Will be used for different search features.");
	}
	else //Will be the deafult sorting with soonest event on top. Will change from 1 to else
	{
		//query selects all todos which are created by the user and returns them with soonest eventDate
		//on top and the farthest eventDate on bottom.
		const sort = `SELECT * FROM todo 
		JOIN users_to_todo ON users_to_todo.idTODO = todo.idTODO
		WHERE users_to_todo.idUSER = $1
		ORDER BY todo.eventDate ASC`;


		//Will sort and return sortedTodos which we can parse with handlebars to display
		await db.any(sort, user.id)
			.then(data => {
				const sortedTodos = data;
				res.render('partials/todos', {
					sortedTodos
				});
			});
	}
	//Need to sort, and then render while passing the returned query results
	//For inital render, if we want to have stuff, we need to put the default search prior to rendering?
});



/*
---------------------------------
Create todos Routes
---------------------------------
*/

app.get("/", function (req, res) {
	res.redirect('/create_todo');
});

app.get('/create_todo', function (req, res) {
	res.render('partials/create_todo');
});


app.post('/create_todo', async (req, res) => {
	const { event, date, time, location, description } = req.body;
	const insertQuery =
		`INSERT INTO todo (eventDate, eventTime, eventTitle, eventDesc, eventLocation)
    VALUES ($1, $2, $3, $4, $5)`;

	const searchQuery =
		`SELECT  idTODO 
	FROM todo WHERE eventDate = $1 AND eventTime = $2 AND eventTitle = $3 AND eventDesc = $4 AND eventLocation = $5 LIMIT 1`;
	try {



		//inserts the row
		await db.none(insertQuery, [date, time, event, description, location]);
		//finds row id
		const todoRow = await db.oneOrNone(searchQuery, [date, time, event, description, location]);
		if (!todoRow) {
			throw new Error('Failed to find the inserted todo row');
		}
		const idTODO = todoRow.idtodo;
		// links user to the new table row
		const userToTodoQuery = `
			INSERT INTO users_to_todo (idTODO, idUser)
			VALUES ($1, $2)`;
		await db.none(userToTodoQuery, [idTODO, req.session.user.id]);
		res.redirect('/todos');
	} catch (error) {
		console.log('Error creating a new todo:', error);
		// Handle error response here if necessary
		console.log(req.session.user);
	}
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
