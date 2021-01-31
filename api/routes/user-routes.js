const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user-controller');


/**
 * @description create a new user and hash password to save in database
 * @request { "email": "some@mail.com", "password": "testpass11" }
 */
router.post("/signup", UserController.user_signup);

/**
* @request { "email": "some@mail.com", "password": "testpass11" }
* @response {
*   "message": "Auth successful",
*   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 */
router.post("/login", UserController.user_login);

/**
 * @request { "email": "some@mail.com" | "password": "testpass11" | "name": "Jon" }
 */
router.patch('/', checkAuth, UserController.user_update_data)

router.delete("/:userId", checkAuth, UserController.user_delete);


module.exports = router;
