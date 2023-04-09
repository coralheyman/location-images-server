"use strict";

class StoreUser {
  get rules() {
    return {
      name: "required",
      identification: "required",
      email: "required|email",
    };
  }

  get validateAll () {
    return true
  }

  get messages () {
    return {
      'name.required': 'You must provide a name for the user.',
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'password.required': 'You must provide a password',
      'identification.required': 'You must provide a identification'
    }
  }
}

module.exports = StoreUser;
