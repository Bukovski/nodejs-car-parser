# NodeJS car parser

## Install
* Install all packages  `npm i`
* All settings save to `config.env`. Rename `config-example.env` to `config.env` and change settings inside


## config.env
- PORT - port number for start the server
- MONGODB_URL - mongodb database connection address
- JWT_KEY - secret jwt key


## Available Scripts
In the project directory, you can run:
* `npm run dev` start project in development mode
* `npm run prod` start project in production mode (saving all error in `morgan.log` file)

Runs the app in the development mode. Open http://localhost:3000 to view it in the browser.


## Built With
* [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - allows you to hash and encrypt sensitive data, such as user passwords, before storing them in the database.
* [cheerio](https://cheerio.js.org/) - implements a subset of core jQuery. Works with a very simple, consistent DOM model (Used for parsing)
* [dotenv](https://github.com/motdotla/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`
* [express](https://expressjs.com/ru/) - minimal and flexible Node.js web application framework
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - for generating access tokens based on JSON format
* [mongoose](https://mongoosejs.com/) - is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
* [morgan](https://github.com/expressjs/morgan) - HTTP `request logger` middleware for node.js
* [multer](https://github.com/expressjs/multer) - middleware for handling `multipart/form-data`, which is primarily used for `uploading files`
* [nodemon](https://nodemon.io/) - monitor for any changes in your source and automatically restart your server
* [request](https://github.com/request/request) - to make http calls. It supports HTTPS and follows redirects by default (Used for parsing).


## Routes
* `/products` products
* `/orders` orders
* `/user` user

