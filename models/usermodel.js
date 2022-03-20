const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserShcema = new Schema({
  username: {type: String,required: true},
  useremail: {type: String,required: true},
  hashpwd: {type: String,required: true},
  publicKey: {type: String,required: true},
  balance : {type: Number,required: true}, 
  approve : {type: Number,required: true}, 
  campapprove : {type: Number,required: true},
  count : {type: Number,required: true}, 
  type : {type: String,required: true}, 
  hasharray : [String],
});

// UserShcema.plugin(uniqueValidator);
module.exports = mongoose.model('User',UserShcema);