const { LogicalException } = require("@adonisjs/generic-exceptions");

class BadRequestException extends LogicalException {
  constructor(errorMessage, status, code) {
    const message = `BAD_REQUEST_ERROR: ${errorMessage}`;
    super(message, status, code);
  }

  async handle (error, { response, request }) {
    response.status(error.status).send({
        status: false,
        message: error.message,
        data: {},
    })
  }
}

module.exports = BadRequestException;