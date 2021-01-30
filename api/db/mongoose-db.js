const mongooseDb = require('mongoose')


mongooseDb.connect(process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);

mongooseDb.Promise = global.Promise;
