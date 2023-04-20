"use strict";

const NotFoundException = use("App/Exceptions/NotFoundException");
const status = use("http-status");
const Firestore = use("App/Models/Firestore");
const firestore = new Firestore();
const db = firestore.db();

// Reference to
const uploadReference = db.collection("upload");
const userReference = db.collection("users");

class UploadController {
  async create({ request, response }) {
    const data = request.only(["description", "user_id"]);
    let user = await this.getById(params.id);
    if (!user) {
      throw new NotFoundException(`User with id: ${data.email} not found`, status.OK);
    }

    let create = await uploadReference.add({
      description: data.description,
      user_id: data.user_id,
    });
    return response.status(201).json({
      status: true,
      message: create,
      data: null,
    });
  }

  async getUserById(id) {
    let getUser = await userReference.doc(id).get();
    return getUser.data();
  }

  async all({ response }) {
    let uploads = [];

    await uploadReference.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let id = doc.id;
        let obj = doc.data();

        uploads.push({
          id,
          ...obj,
        });
      });
    });

    return response.status(201).json({
      status: true,
      message: "All uploads",
      data: uploads,
    });
  }

  async update({ request, response }) {
    const params = request.params;
    const data = request.only([""]);

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

module.exports = UploadController;
