const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products-controller');


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

router.get("/", ProductsController.products_get_all);

/**
 * @description create a new product only if set auth header
 * @request {"name": "string", "price": "number", "productImage": "file" }
 * @header "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV..." login user token
 */
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product)

router.get("/:productId", ProductsController.products_get_product);

/**
 * @description modify a product by product id only if set auth header
 * @request { "name": "string" | "price": "number" | "productImage": "file" }
 * @header "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV..." login user token
 */
router.patch("/:productId", checkAuth, upload.single('productImage'), ProductsController.products_update_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete);


module.exports = router;
