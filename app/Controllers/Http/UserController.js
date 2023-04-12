"use strict";

const BadRequestException = use("App/Exceptions/BadRequestException");

const NotFoundException = use("App/Exceptions/NotFoundException");
const jwt = use("jsonwebtoken");
const status = use("http-status");
const Env = use("Env");

const { validate } = use("Validator");

const Firestore = use("App/Models/Firestore");
const firestore = new Firestore();
const db = firestore.db();

// Reference to
const userReference = db.collection("users");

class UserController {
  async login({ request, response }) {
    const { email, password } = request.all();
    const users = await this.getUserByEmail(email);
    if (users && users.length > 0) {
      const user = users[0].data();
      user.id = users[0].id
      if (user.password !== password) {
        throw new NotFoundException(`User ${email} not found`, status.OK);
      } else {
        const token = jwt.sign(
          { id: user.id, email },
          Env.getOrFail("APP_KEY"),
          { expiresIn: "2h" }
        );
        return response.status(200).json({
          status: true,
          data: { ...user, token},
        });
      }
    } else {
      throw new NotFoundException(`User ${email} not found`, status.OK);
    }
  }

  async create({ request, response }) {
    const data = request.only([
      "name",
      "email",
      "admin",
      "identification",
      "password",
    ]);
    const userRef = await this.getUserByEmail(data.email);
    if (userRef.length == 0) {
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
        message: `The user with email ${data.email} already exists`,
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
    const params = request.params;
    const data = request.only(["name", "admin", "identification", "password", "email"]);

    let user = this.getById(params.id);

    let update = await userReference.doc(params.id).update({
      name: data.name ? data.name : user.name,
      admin: data.admin != undefined ? data.admin : user.admin,
      identification: data.identification ? data.identification : user.identification,
      password: data.password ? data.password : user.password,
      email: data.email ? data.email : user.email,
    });

    if (update) {
      let user = await this.getById(params.id);

      return response.status(201).json({
        status: true,
        message: "User updated successfully",
        data: user,
      });
    }
  }

  async delete({ request, response }) {
    const data = request.params;
    const deleted = await userReference.doc(data.id).delete();
    return response.status(201).json({
      status: true,
      message: "User deleted successfully",
      data: deleted,
    });
  }
}

module.exports = UserController;
