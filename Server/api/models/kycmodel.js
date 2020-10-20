const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;


const KycShcema = new Schema({
    nid: {type: String,required: true},
    birthdate: {type: Date,required: true},
    imagecolection: {type: Array, required: true},
    fname: {type: String,required: true},
    telno: {type: String,required: true},
    addressone: {type: String,required: true},
    addresstwo: {type: String,required: true},
    userid: {type: String,required: true},
    Kycapprove : {type: Number,required: true }, 
  });

//   KycShcema.plugin(uniqueValidator);
  module.exports = mongoose.model('Kyc',KycShcema);
  