const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[ 1 ]; // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...
        const decoded = jwt.verify(token, process.env.JWT_KEY); // check token
        
        req.userData = decoded;
        
        next();
    } catch (error) { // if token is not real or its lifetime (1 hour) has expired
        return res.status(401).json({ message: 'Auth failed' });
    }
};
