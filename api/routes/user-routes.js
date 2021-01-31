const express = require("express");
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user-controller');


const uploadAvatar = multer({
	limits: {
		fileSize: 1024 * 1024 * 2 // bite size (2mb)
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload an image'))
		}
		
		cb(null, true)
	}
});

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

router.get("/:userId", checkAuth, UserController.user_get_user);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

/**
 * @request { "avatar": file }
 */
router.post('/avatar', checkAuth, uploadAvatar.single('avatar'), UserController.user_load_avatar);

router.delete('/avatar', checkAuth, UserController.user_delete_avatar);

router.get('/avatar/:id', UserController.user_get_avatar);


module.exports = router;
