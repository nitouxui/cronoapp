const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getDatabase} = require("firebase-admin/database");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

initializeApp({
  databaseURL: "https://cronoapp-97aa6-default-rtdb.firebaseio.com"
});

const ADMIN_EMAIL = "quidel.dsgn@gmail.com";

exports.getRoomOwners = onCall(
  {region: "us-central1", maxInstances: 2},
  async (request) => {
    const token = request.auth?.token;
    const email = typeof token?.email === "string" ? token.email.toLowerCase() : "";
    const signInProvider = token?.firebase?.sign_in_provider;

    if (
      !request.auth ||
      token?.email_verified !== true ||
      signInProvider !== "google.com" ||
      email !== ADMIN_EMAIL
    ) {
      throw new HttpsError("permission-denied", "No tienes permiso para consultar los propietarios.");
    }

    const snapshot = await getDatabase().ref("rooms").get();
    const rooms = snapshot.val() || {};
    const ownersByRoom = {};
    const roomOwners = Object.entries(rooms).map(([roomId, room]) => ({
      roomId,
      uid: typeof room?.ownerUid === "string" ? room.ownerUid : roomId
    }));

    for (let start = 0; start < roomOwners.length; start += 10) {
      const batch = roomOwners.slice(start, start + 10);
      const records = await Promise.all(batch.map(async ({roomId, uid}) => {
        try {
          const user = await getAuth().getUser(uid);
          return [roomId, user.email || null];
        } catch (error) {
          if (error?.code === "auth/user-not-found") return [roomId, null];
          throw error;
        }
      }));
      for (const [roomId, ownerEmail] of records) ownersByRoom[roomId] = ownerEmail;
    }

    return {ownersByRoom};
  }
);
