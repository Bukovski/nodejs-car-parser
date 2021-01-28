const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

mongoose.Promise = global.Promise;
