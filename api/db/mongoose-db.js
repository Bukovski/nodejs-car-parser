const mongooseDb = require('mongoose')


mongooseDb.connect(process.env.MONGODB_URL,
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

mongooseDb.Promise = global.Promise;
