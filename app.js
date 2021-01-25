const express = require('express');
const app = express();


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


module.exports = app;
