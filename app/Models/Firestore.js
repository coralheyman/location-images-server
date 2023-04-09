const Model = use("Model");

const admin = require("firebase-admin");

const serviceAccount = require("../../images-location-firebase-adminsdk-b4oei-4b01dadc82.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  name: "ImagesLocationOnFirebase",
});


class Firestore extends Model {
  // call on firestore
  db() {
    return admin.firestore();
  }
}

module.exports = Firestore;
