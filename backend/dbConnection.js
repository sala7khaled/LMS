require("dotenv").config();

const mongoose = require("mongoose");

module.exports = function dbConnection() {

  //cluster config 
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      auth: {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD
      }
    })
    .then(db => console.log(`DB is connected`))
    .catch(err => console.error(err));

  //local db config 

  // mongoose.connect("mongodb://localhost:27017/LMS", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useFindAndModify: false
  // });
};
