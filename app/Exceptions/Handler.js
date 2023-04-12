'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

const customExceptionList = [
  'BadRequestException',
]

class ExceptionHandler extends BaseExceptionHandler {
  async handle (error, { response, request }) {
    if (customExceptionList.includes(error.name)) {
      return error.handle(error, { response, request })
    }
    const {  message, status } = error
    console.log(error);
    return response.status(status).send({ success: 'false', message })
  }

  getRequestData (request) {
    return {
      uri: request.uri,
      qs: request.qs,
      body: request.body,
      url: request.url,
      method: request.method,
    }
  }
}

module.exports = ExceptionHandler

