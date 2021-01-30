const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders-controller');



router.get('/', checkAuth, OrdersController.orders_get_all)

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
router.post('/', checkAuth, OrdersController.orders_create_order)

router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);


module.exports = router;
