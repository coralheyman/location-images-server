const Firestore = use("App/Models/Firestore");
const firestore = new Firestore();
const db = firestore.db();

// Reference to
const uploadReference = db.collection("upload");
class UploadRepository {

  async getById(id) {
    let getUpload = await uploadReference.doc(id).get();
    return getUpload.data();
  }

  async createUpload(data){
    return await uploadReference.add({
      description: data.description,
      user_id: data.user_id,
      create_at: Date.now(),
    });
  }

  async all() {
    let lst = [];
    await uploadReference.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        let id = doc.id;
        let obj = doc.data();

        lst.push({
          id,
          ...obj,
        });
      });
    });

    return lst;
  }

  async update(id, data, obj) {
    let update = await uploadReference.doc(id).update({
      description: data.description ? data.description : obj.description,
    });

    if (update) {
      return await this.getById(id);
    }
    return
  }

  async delete(id) {
    const deleted = await uploadReference.doc(id).delete();
    return deleted
  }
}

module.exports = UploadRepository;
