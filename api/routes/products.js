const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product')


router.get('/', (req, res, next) => {
	Product.find()
		.exec()
		.then(doc => {
			console.log("GET products", doc)
			
			res.status(200).json(doc)
		})
		.catch(err => {
			console.log(err)
			
			res.status(500).json({ error: err })
		})
})

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	
	product
		.save()
		.then(result => {
			console.log(result)
			
			res.status(200).json({
				message: 'POST products',
				createdProduct: result
			})
		})
		.catch(err => {
			console.log(err)
			
			res.status(500).json({
				error: err
			})
		});
})

router.get("/:productId", (req, res, next) => {
	const id = req.params.productId;
	
	Product.findById(id)
		.exec()
		.then(doc => {
			console.log("From DB", doc)
			
			if (doc) {
				res.status(200).json(doc)
			} else {
				res.status(404).json({ message: 'No valid Product ID'})
			}
		})
		.catch(err => {
			console.log(err)
			
			res.status(500).json({ error: err })
		})
});

router.patch("/:productId", (req, res, next) => {
	res.status(200).json({
		message: 'Updated product!',
	})
});

router.delete("/:productId", (req, res, next) => {
	res.status(200).json({
		message: 'Deleted product!',
	})
});




module.exports = router;
