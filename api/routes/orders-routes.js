const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order-model');
const Product = require("../models/product-model");



router.get('/', checkAuth, async (req, res) => {
	try {
		const order = await Order.find()
			.select("product quantity _id")
			.populate("product", [ "name", "price" ])
		
		res.status(200).json({
			count: order.length,
			orders: order.map(doc => {
				return {
					_id: doc._id,
					product: doc.product,
					quantity: doc.quantity,
					request: {
						type: "GET",
						url: "http://localhost:3000/orders/" + doc._id
					}
				};
			})
		})
	} catch (err) {
		res.status(500).json({ error: err })
	}
})


/**
 * @description create a new order only if set auth header
 *
 * productId - a product id for new order
 * quantity - default 1
 *
 * @header "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV..." login user token
 * @request { "productId": "string" | "quantity": "number" }
 * @example {	"productId": "60056abd4e17ef4e922b40cc", "quantity": 22 }
 */
router.post('/', checkAuth, async (req, res, next) => {
	try {
		const product = await Product.findById(req.body.productId)
		
		if (!product) return res.status(404).json({ message: "Product not found" });
		
		const order = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		});
		
		const result = await order.save();
		
		res.status(201).json({
			message: "Order stored",
			createdOrder: {
				_id: result._id,
				product: result.product,
				quantity: result.quantity
			},
			request: {
				type: "GET",
				url: "http://localhost:3000/orders/" + result._id
			}
		});
	} catch (err) {
		res.status(500).json({ error: err })
	}
})


router.get("/:orderId", checkAuth, async (req, res, next) => {
	const _id = req.params.orderId;
	
	try {
		const order = await Order.findById(_id)
			.populate("product")
		
		if (!order) return res.status(404).json({ message: "Order not found" });
		
		res.status(200).json({
			order: order,
			request: {
				type: "GET",
				url: "http://localhost:3000/orders"
			}
		});
	} catch (err) {
		res.status(500).json({ error: err })
	}
});


router.delete("/:orderId", checkAuth, async (req, res, next) => {
	const _id = req.params.orderId;
	
	try {
		const order = await Order.findByIdAndDelete(_id)
		
		if (!order) return res.status(404).json({ message: "Order not found" });
		
		res.status(200).json({
			message: "Order deleted",
			request: {
				type: "POST",
				url: "http://localhost:3000/orders",
				body: {
					productId: "ID",
					quantity: "Number"
				}
			}
		});
	} catch (err) {
		res.status(500).json({ error: err })
	}
});


module.exports = router;
