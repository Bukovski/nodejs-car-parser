const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');


app.disable('x-powered-by'); // hide x-powered-by header!
app.use(morgan('dev')); // logger
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


app.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET products',
	})
})

app.post('/', (req, res, next) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	}
	
	res.status(200).json({
		message: 'POST products',
		createdProduct: product
	})
})


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
