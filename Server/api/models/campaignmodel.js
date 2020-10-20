const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const CampaignShcema = new Schema({
    userid: {type: String,required: true},
    image: {type: String,required: true},
    campaignname: {type: String, required: true},
    amount: {type: Number,required: true},
    story: {type: String,required: true},
    targetdate: {type: Date,required: true},
    Campapprove : {type: Number,required: true},
    collect : {type: Number, required: true},
    likecount : {type: Number, required: true} 
  });

//   KycShcema.plugin(uniqueValidator);
  module.exports = mongoose.model('Campaign',CampaignShcema);