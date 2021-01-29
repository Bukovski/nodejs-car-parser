const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product-model')


router.get('/', async (req, res) => {
	try {
		const product = await Product.find({})
			.select("name price _id")
		
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ error: err })
	}
})


/**
 * @description create a new product
 * @request {"name": "string", "price": "number"}
 */
router.post('/', async (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	
	try {
		await product.save();
		
		res.status(200).json({
			message: 'POST products',
			createdProduct: {
				name: product.name,
				price: product.price,
				_id: product._id,
				request: {
					type: "GET",
					url: "http://localhost:3000/products/" + product._id
				}
			}
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})


router.get("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	try {
		const product = await Product.findById(_id)
		
		if (!product) return res.status(404).json({ message: 'No valid entry found for provided ID'})
		
		res.status(200).json({
			product: product,
			request: {
				type: "GET",
				url: "http://localhost:3000/products"
			}
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
});


/**
 * @description modify a product by product id
 * @request { "name": "string" | "price": "number" }
 */
router.patch("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	const updates = Object.keys(req.body)
	const allowedUpdates = [ 'name', 'price' ]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	
	if (!isValidOperation) return res.status(400).send({ error: 'Invalid fields for updates!' })

	try {
		const product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
		if (!product) return res.status(404).json({ error: "Product Id not found" });
		
		res.status(200).json({
			message: "Product updated",
			request: {
				type: "GET",
				url: "http://localhost:3000/products/" + _id
			}
		})
	} catch (err) {
		res.status(400).json({ error: err })
	}
});


router.delete("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	try {
		const product = await Product.findByIdAndDelete(_id)
		
		if (!product) return res.status(404).json({ error: "Product Id not found" });
		
		res.status(200).json({
			message: "Product deleted",
			request: {
				type: "POST",
				url: "http://localhost:3000/products",
				body: {
					name: "String",
					price: "Number"
				}
			}
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
});



module.exports = router;
