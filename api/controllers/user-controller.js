const User = require("../models/user-model");



exports.user_signup = async (req, res, next) => {
  try {
    if (req.body.password && req.body.password.length() < 7)  return res.status(409).json({ message: "Password must be longer than 6 characters" });
    
    const _user = await User.find({ email: req.body.email })
    
    if (_user.length) return res.status(409).json({ message: "Mail exists" });
    
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    
    user.save()
      .then(result => {
        res.status(201).json({ message: "User created" });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.user_login = async (req, res, next) => {
  try {
    const _user = await User.findByCredentials(req.body.email, req.body.password);
    const _token = await _user.generateAuthToken();
    
    res.status(200).json({
      message: "Auth successful",
      token: _token
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.user_update_data = async (req, res, next) => {
  const _auth = req.authUserInfo;
  
  const updates = Object.keys(req.body)
  const allowedUpdates = [ 'name', 'email', 'password' ]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidOperation) return res.status(400).send({ message: 'Invalid updates!' });
  
  if (req.body.email && _auth.email !== req.body.email) return res.status(400).send({ message: "You can't change data of this user" });
  
  try {
    const _user = await User.findByIdAndUpdate(_auth._id, req.body, { new: true, runValidators: true })
  
    const _token = await _user.generateAuthToken();
    
    const response = {
      message: "User data updated",
      token: _token,
      request: {
        type: "GET",
        url: "http://localhost:3000/user/" + _user._id
      }
    };
    
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

exports.user_get_user = async (req, res, next) => {
  const _auth = req.authUserInfo;
  
  try {
    if (_auth._id !== req.params.userId) return res.status(400).send({ message: "You don't have access rules" });
    
    const response = {
      name: _auth.name,
      email: _auth.email,
    }
    
    res.status(200).json({ user: response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.user_delete_user = async (req, res, next) => {
  try {
    await User.remove({ _id: req.params.userId });
    
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

