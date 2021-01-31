const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    }
}, {
    timestamps: true
});


userSchema.statics.findByCredentials = async (email, password) => {
    const _user = await User.findOne({ email }) // find user from email
    
    if (_user && !_user.email) return new Error("User with this email not found");
    
    const isMatch = await bcrypt.compare(password, _user.password) //decodes the password from db and compares it with the one sent by the user
    
    if (!isMatch) return new Error("Unable to login");
    
    
    return _user
}

userSchema.methods.generateAuthToken = async function () {
    const _user = this
    
    const token = jwt.sign(
      {
          _id: _user._id,
          name: _user.name,
          email: _user.email,
      },
      process.env.JWT_KEY, // secret key from config.env
      {
          expiresIn: "7d" // "2 days", "10h", "7d"
      }
    );
    
    return token
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password')) {
        /**
         * encode user password
         * @example testpass11 => $2a$10$ar8eQTX6OhnWQSURu07ZeuZ04DF1Q29x2e6RJz1tnDSBr7fniAHAC
         */
        user.password = await bcrypt.hash(user.password, 10) // 10 - it is salt
    }
    
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;
