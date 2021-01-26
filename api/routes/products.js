const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'GET products',
	})
})

router.post('/', (req, res, next) => {
	const product = {
		name: req.body.name,
		price: req.body.price
	}
	
	res.status(200).json({
		message: 'POST products',
		createdProduct: product
	})
})

router.get("/:productId", (req, res, next) => {
	const id = req.params.productId;
	
	if (id === 'special') {
		res.status(200).json({
			message: 'Spacial ID',
			id: id
		})
	} else {
		res.status(200).json({
			message: 'Passed ID'
		})
	}
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
