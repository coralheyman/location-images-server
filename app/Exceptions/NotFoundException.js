'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class NotFoundException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
  constructor(errorMessage, status, code) { 
    const message = `NOT_FOUND_EXCEPTION: ${errorMessage}`;
    super(message, status, code);
  }

  async handle(error, { response }) {}
}

module.exports = NotFoundException
