// Source:
// https://appdividend.com/2018/07/18/react-redux-node-mongodb-jwt-authentication/#React_Redux_Node_MongoDB_JWT_Authentication

const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateSignup = (data) => {
  const errors = {};

  /* eslint-disable no-param-reassign */
  data.username = !isEmpty(data.username) ? data.username : '';
  data.useremail = !isEmpty(data.useremail) ? data.useremail : '';
  data.publicKey = !isEmpty(data.publicKey) ? data.publicKey : '';
  data.encryptedSecret = !isEmpty(data.encryptedSecret) ? data.encryptedSecret : '';
  /* eslint-enable no-param-reassign */

  if (!validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = 'Name must be between 2 and 30 chars';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Name field is required';
  }

  if (!validator.isEmail(data.useremail)) {
    errors.useremail = 'Email is invalid';
  }

  if (validator.isEmpty(data.useremail)) {
    errors.useremail = 'Email is required';
  }

  if (validator.isEmpty(data.publicKey)) {
    errors.publicKey = 'publicKey is required';
  }

  if (validator.isEmpty(data.encryptedSecret)) {
    errors.encryptedSecret = 'encryptedSecret is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateSignup;
