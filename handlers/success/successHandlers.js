const { customSuccess } = require('./customSuccess');

const successHandler = (success, req, res, next) => {
  if (success instanceof customSuccess) {
    const localizedMessage = req.t(success.successMessage);
    return res.status(success.successCode).send({
      successCode: success.successCode,
      message: localizedMessage,
    });
  }

  res.status(500).send({ message: 'Unknown Error' });
};

module.exports = { successHandler };
