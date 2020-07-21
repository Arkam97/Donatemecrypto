import * as Joi from "@hapi/joi";
const mongoose = require('mongoose');
const { Schema } = mongoose;

export const registerSchema = Joi.object({
  alias: Joi.string().required(),
  email: Joi.string().optional().allow(""),
  publicKey: Joi.string().required(),
  encryptedSecret: Joi.string().optional().allow(""),
  authType: Joi.number().valid(0, 1, 2).optional(),
});

export const loginSchema = Joi.object({
  key: Joi.string().required(),
  password: Joi.string().optional(),
});



export const addInitiativeSchema = Joi.object({
  name: Joi.string().optional(),
  txnhash: Joi.string().optional(),
  xdr: Joi.string().optional(),
  goal: Joi.number().optional(),
  creator: Joi.string().optional(),
  recipient: Joi.string().optional(),
  recipientType: Joi.string().optional(),
  endDate: Joi.string().optional(),
  cover: Joi.string().optional(),
  description: Joi.string().optional(),
  paymentDetails: Joi.object().optional(),
});

export const editInitiativeSchema = Joi.object({
  name: Joi.string().optional(),
  txnhash: Joi.string().optional(),
  xdr: Joi.string().optional(),
  goal: Joi.number().optional(),
  creator: Joi.string().optional(),
  recipient: Joi.string().optional(),
  recipientType: Joi.string().optional(),
  endDate: Joi.string().optional(),
  cover: Joi.string().optional(),
  description: Joi.string().optional(),
  paymentDetails: Joi.object().optional(),
});

export const fundSchema = Joi.object({
  xdr: Joi.string().required(),
});


const FundransactionSchema = new Schema({
    xdr: {type: String}
  });


const CampaignSchema = new Schema({
  _id: {type: String},
  name: {type: String},
  txnhash: {type: String},
  goal: {type: String},
  creator: {type: String},
  recipient: {type: String},
  recipientType: {type: String},
  endDate: {type: String},
  cover: {type: String},
  description: {type: String},
  paymentDetails: {type: String},
  createdAt: {type: String},
  updatedAt: {type: String},
});

const UserShcema = new Schema({
  _id:{type: String},
  name: {type: String},
  email: {type: String},
  // dob: {type: String},
  // verified:{type: Boolean},
  // authType: {type: String},
  // type: {type: String},
  publicKey: {type: String},
  pash: {type: String},
  // createdAt: {type: String},
  // updatedAt: {type: String},
});


const KYCSchema =  new Schema({
  _id: {type: String},
  publicKey: {type: String},
  idNo: {type: String},
  dob:{type: Date},
  idFront:{type: String},
  idBack: {type: String},
  faceIdFront: {type: String},
  fullname:{type: String},
  telephone: {type: String},
  addressLineOne: {type: String},
  addressLineTwo: {type: String},
  city: {type: String},
  province: {type: String},
  country: {type: String},
  approved: {type: Boolean},
  createdAt: {type: String},
  updatedAt: {type: String},
})
export const addKYCSchema = Joi.object({
  idNo: Joi.string().required(),
  dob: Joi.date().required(),
  idFront: Joi.string().required(),
  idBack: Joi.string().required(),
  faceIdFront: Joi.string().required(),
  fullname: Joi.string().required(),
  telephone: Joi.string().required(),
  addressLineOne: Joi.string().required(),
  addressLineTwo: Joi.string().optional().allow(""),
  city: Joi.string().required(),
  province: Joi.string().optional(),
  zipCode: Joi.number().required(),
  country: Joi.string().required(),
});

module.exports =mongoose.model('user',UserShcema);
module.exports =mongoose.model('kyc',KYCSchema);
module.exports =mongoose.model('campaign',CampaignSchema);
module.exports =mongoose.model('fund',FundransactionSchema);



