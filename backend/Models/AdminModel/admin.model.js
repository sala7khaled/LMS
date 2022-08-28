var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  _id:mongoose.Schema.Types.ObjectId,
  email: {type:String,required:true}, 
  password: {type:String,required:true},

});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');