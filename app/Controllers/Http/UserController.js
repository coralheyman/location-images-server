"use strict";

const { ioc } = use("@adonisjs/fold");
const NotFoundException = use("App/Exceptions/NotFoundException");
const jwt = use("jsonwebtoken");
const status = use("http-status");
const Env = use("Env");

class UserController {
  constructor() {
    this.userRespository = ioc.make("App/Repositories/UserRepository");
  }

  async login({ request, response }) {
    const { email, password } = request.all();
    const users = await this.userRespository.getUserByEmail(email);
    if (users && users.length > 0) {
      const user = users[0].data();
      user.id = users[0].id;
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
          data: { ...user, token },
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
    const userRef = await this.userRespository.getUserByEmail(data.email);
    if (userRef.length == 0) {
      let create = await this.userRespository.createUser(data);
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

  async all({ response }) {
    const users = await this.userRespository.all();
    return response.status(201).json({
      status: true,
      message: "All users",
      data: users,
    });
  }

  async update({ request, response }) {
    const params = request.params;
    const data = request.only([
      "name",
      "admin",
      "identification",
      "password",
      "email",
    ]);

    let user = await this.userRespository.getById(params.id);

    let userUpdated = await this.userRespository.update(params.id, data, user);

    return response.status(201).json({
      status: true,
      message: "User updated successfully",
      data: userUpdated,
    });
  }

  async delete({ request, response }) {
    const data = request.params;
    const deleted = await this.userRespository.delete(data.id);
    return response.status(201).json({
      status: true,
      message: "User deleted successfully",
      data: deleted,
    });
  }
}

module.exports = UserController;
