"use strict";

const { validate } = use("Validator");

const Firestore = use("App/Models/Firestore");

const firestore = new Firestore();
const db = firestore.db();

// Reference to
const userReference = db.collection("users");

class UserController {
  async create({ request, response }) {
    const data = request.only([
      "name",
      "email",
      "admin",
      "identification",
      "password",
    ]);
    const userRef = await this.getUserByEmail(data.email);
    if (!userRef) {
      let create = await userReference.add({
        name: data.name,
        email: data.email,
        admin: data.admin,
        identification: data.identification,
        password: data.password,
      });
      if (create) {
        return response.status(201).json({
          status: true,
          message: create,
          data: null,
        });
      }
    } else {
      return response.status(201).json({
        status: false,
        message: `The user with email ${data.email} already exists}`,
        data: null,
      });
    }
  }

  async getUserByEmail(email) {
    const querySnapshot = await userReference.where("email", "==", email).get();
    return querySnapshot.docs;
  }

  async getById(id) {
    let getUser = await userReference.doc(id).get();
    return getUser.data();
  }

  async all({ response }) {
    let users = [];

    await userReference.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let id = doc.id;
        let user = doc.data();

        users.push({
          id,
          ...user,
        });
      });
    });

    return response.status(201).json({
      status: true,
      message: "All users",
      data: users,
    });
  }

  async update({ request, response }) {
    const rules = {
      id: "required",
    };

    const params = request.params
    const data = request.only([
      "name",
      "admin",
      "identification",
      "password",
    ]);

    const validation = await validate(params, rules);

    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages(),
        data: null,
      });
    }

    let user = this.getById(params.id);

    let update = await userReference.doc(params.id).update({
      name: data.name ? data.name : user.name,
      admin: data.admin != undefined ? data.admin : user.admin,
      identification: data.identification ? data.identification : user.identification,
      password: data.password ? data.password : user.password,
    });

    if (update) {
      let user = this.getById(params.id)

      return response.status(201).json({
        status: true,
        message: "User updated successfully",
        data: user,
      });
    }
  }

  async delete({ request, response }) {
    const rules = {
      id: "required",
    };

    const data = request.params;

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response.status(206).json({
        status: false,
        message: validation.messages()[0].message,
        data: null,
      });
    }

    const deleted = await userReference.doc(data.id).delete();

    return response.status(201).json({
      status: true,
      message: "User deleted successfully",
      data: deleted,
    });
  }
}

module.exports = UserController;
