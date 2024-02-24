const { customError } = require("./customError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof customError) {
      const localizedMessage = err.message;
      return res
        .status(err.errorCode)
        .json({
          error: true,
          errorCode: err.errorCode,
          message: localizedMessage,
        });
    }
      res.status(500).send({ message: err.message });
  };
  
  module.exports = { errorHandler };
  