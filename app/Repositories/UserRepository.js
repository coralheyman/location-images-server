const Firestore = use("App/Models/Firestore");
const firestore = new Firestore();
const db = firestore.db();
// Reference to
const userReference = db.collection("users");
class ValidationLogRepository {
  async getUserByEmail(email) {
    const querySnapshot = await userReference.where("email", "==", email).get();
    return querySnapshot.docs;
  }

  async createUser(data){
    return await userReference.add({
      name: data.name,
      email: data.email,
      admin: data.admin,
      identification: data.identification,
      password: data.password,
    });
  }

  async getById(id) {
    let getUser = await userReference.doc(id).get();
    return getUser.data();
  }

  async all() {
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

    return users;
  }

  async update(id, data, user) {
    let update = await userReference.doc(id).update({
      name: data.name ? data.name : user.name,
      admin: data.admin != undefined ? data.admin : user.admin,
      identification: data.identification ? data.identification : user.identification,
      password: data.password ? data.password : user.password,
      email: data.email ? data.email : user.email,
    });

    if (update) {
      return await this.getById(id);
    }
    return
  }

  async delete(id) {
    const deleted = await userReference.doc(id).delete();
    return deleted
  }
}

module.exports = ValidationLogRepository;
