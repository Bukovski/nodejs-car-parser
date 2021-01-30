const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user-model");



exports.user_signup = async (req, res, next) => {
  try {
    const _user = await User.find({ email: req.body.email })
    
    if (_user.length) return res.status(409).json({ message: "Mail exists" });
    
    /**
     * encode user password
     * @example testpass11 => $2a$10$ar8eQTX6OhnWQSURu07ZeuZ04DF1Q29x2e6RJz1tnDSBr7fniAHAC
     */
    bcrypt.hash(req.body.password, 10, (err, hash) => { // 10 - it is salt
      if (err) return res.status(500).json({ error: err });
      
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      
      user.save()
        .then(result => {
          res.status(201).json({ message: "User created" });
        })
        .catch(err => {
          res.status(500).json({ error: err });
        });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.user_login = async (req, res, next) => {
  try {
    const _user = await User.find({ email: req.body.email })
    
    if (!_user.length) return res.status(401).json({ message: "Auth failed" });
    
    bcrypt.compare(req.body.password, _user[ 0 ].password, (err, result) => {
      if (err) return res.status(401).json({ message: "Auth failed" });
      
      if (result) {
        const token = jwt.sign(
          {
            email: _user[ 0 ].email,
            userId: _user[ 0 ]._id
          },
          process.env.JWT_KEY, // secret key from config.env
          {
            expiresIn: "1h" // token exist 1 hour
          }
        );
        
        return res.status(200).json({
          message: "Auth successful",
          token: token
        });
      }
      
      res.status(401).json({ message: "Auth failed" });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.user_delete = async (req, res, next) => {
  try {
    await User.remove({ _id: req.params.userId });
    
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
