const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

// import environmental variables from our variables.env file
require('dotenv').config({ path: path.join(__dirname, 'config.env') });
require('./api/db/mongoose-db'); // db connect

const productRoutes = require('./api/routes/products-routes');
const orderRoutes = require('./api/routes/orders-routes');



app.disable('x-powered-by'); // hide x-powered-by header!

if (app.get('env') === 'production') {
	// set morgan to log file
	app.use(morgan('common', {
		skip: (req, res) => res.statusCode < 400,
		stream: fs.createWriteStream(path.join(__dirname, 'morgan.log'), { flags: 'a' })
	}));
} else {
	app.use(morgan('dev')); // logger
}

// get static files in "uploads" folder
app.use('/uploads', express.static('uploads'));

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		
		return res.status(200).json({});
	}
	
	next();
});


// routers
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);


// get error if route not found
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	
	next(error)
})

// catch all errors and show error message
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	
	res.json({
		error: {
			message: err.message
		}
	});
})


module.exports = app;
