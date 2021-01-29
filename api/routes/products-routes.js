const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product-model')


const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		// where do we upload files
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		// file name: time + real file name
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5 //5Mb max file size
	},
	fileFilter: fileFilter
});

/*******************************************/

router.get('/', async (req, res) => {
	try {
		const product = await Product.find({})
			.select("name price _id productImage")
		
		res.status(200).json({
			count: product.length,
			products: product.map(prod => {
				return {
					_id: prod._id,
					name: prod.name,
					price: prod.price,
					productImage: prod.productImage,
					request: {
						type: "GET",
						url: "http://localhost:3000/products/" + prod._id
					}
				}
			})
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})


/**
 * @description create a new product
 * @request {"name": "string", "price": "number", "productImage": "file" }
 */
router.post('/', upload.single('productImage'), async (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	
	try {
		await product.save();
		
		res.status(200).json({
			message: 'POST products',
			createdProduct: {
				_id: product._id,
				name: product.name,
				price: product.price,
				productImage: product.productImage,
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
		const product = await Product.findById(_id).select("name price _id productImage")
		
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
 * @request { "name": "string" | "price": "number" | "productImage": "file" }
 */
router.patch("/:productId", upload.single('productImage'), async (req, res, next) => {
	const _id = req.params.productId;
	
	const updates = Object.keys(req.body)
	const allowedUpdates = [ 'name', 'price' ]
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	
	if (!isValidOperation) return res.status(400).send({ error: 'Invalid fields for updates!' })
	
	if (req.file && req.file.path) { // check file update
		req.body.productImage = req.file.path;
	}
	
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
