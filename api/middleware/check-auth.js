const jwt = require('jsonwebtoken');
const User = require('../models/user-model')


module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[ 1 ]; // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...
        const decoded = jwt.verify(token, process.env.JWT_KEY); // check token
        
        const user = await User.findOne({ _id: decoded._id })
    
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        delete user.password;
    
        req.token = token
        req.authUserInfo = user
        
        next();
    } catch (error) { // if token is not real or its lifetime (1 hour) has expired
        return res.status(401).json({ message: 'Auth failed' });
    }
};
