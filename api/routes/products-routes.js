const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product-model')


router.get('/', async (req, res) => {
	try {
		const product = await Product.find({})
		
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ error: err })
	}
})

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
			createdProduct: product
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})

router.get("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	try {
		const product = await Product.findById(_id)
		
		if (!product) return res.status(404).json({ message: 'No valid Product ID'})
		
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ error: err })
	}
});

router.patch("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	const updates = Object.keys(req.body)
	const allowedUpdates = [ 'name', 'price' ]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	
	if (!isValidOperation) return res.status(400).send({ error: 'Invalid fields for updates!' })

	try {
		const product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
		if (!product) return res.status(404).json({ error: "Product Id not found" });
		
		res.status(200).json(product)
	} catch (err) {
		res.status(400).json({ error: err })
	}
});

router.delete("/:productId", async (req, res, next) => {
	const _id = req.params.productId;
	
	try {
		const product = await Product.findByIdAndDelete(_id)
		
		if (!product) return res.status(404).json({ error: "Product Id not found" });
		
		res.status(200).json(product)
	} catch (err) {
		res.status(500).json({ error: err })
	}
});



module.exports = router;
