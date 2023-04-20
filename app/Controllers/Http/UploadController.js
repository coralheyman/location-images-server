"use strict";

const { ioc } = use("@adonisjs/fold");
const NotFoundException = use("App/Exceptions/NotFoundException");
const status = use("http-status");

class UploadController {
  constructor() {
    this.userRepository = ioc.make("App/Repositories/UserRepository");
    this.uploadRepository = ioc.make("App/Repositories/UploadRepository");
  }
  async create({ request, response }) {
    const data = request.only(["description", "user_id"]);
    let user = await this.userRepository.getById(data.user_id);
    if (!user) {
      throw new NotFoundException(
        `User with id: ${data.user_id} not found`,
        status.OK
      );
    }

    let create = await this.uploadRepository.createUpload(data);
    return response.status(201).json({
      status: true,
      message: create,
      data: null,
    });
  }

  async all({ response }) {
    let uploads = await this.uploadRepository.all();

    return response.status(201).json({
      status: true,
      message: "All uploads",
      data: uploads,
    });
  }

  async update({ request, response }) {
    const params = request.params;
    const data = request.only(["description"]);

    let upload = await this.uploadRepository.getById(params.id);

    let update = await this.uploadRepository.update(params.id, data, upload);

    return response.status(201).json({
      status: true,
      message: "Upload updated successfully",
      data: update,
    });
  }

  async delete({ request, response }) {
    const data = request.params;
    const deleted = await this.uploadRepository.delete(data.id);
    return response.status(201).json({
      status: true,
      message: "Upload deleted successfully",
      data: deleted,
    });
  }
}

module.exports = UploadController;
