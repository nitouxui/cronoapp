const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

initializeApp();

const ADMIN_EMAIL = "quidel.dsgn@gmail.com";

exports.listAuthUsers = onCall({ region: "us-central1", maxInstances: 2 }, async (request) => {
  const token = request.auth?.token;
  if (
    !token ||
    token.email_verified !== true ||
    token.firebase?.sign_in_provider !== "google.com" ||
    String(token.email || "").toLowerCase() !== ADMIN_EMAIL
  ) {
    throw new HttpsError("permission-denied", "Solo la cuenta administradora puede consultar usuarios.");
  }

  const pageToken = typeof request.data?.pageToken === "string" ? request.data.pageToken : undefined;
  try {
    const page = await getAuth().listUsers(1000, pageToken);
    return {
      users: page.users.map((user) => ({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
      })),
      nextPageToken: page.pageToken || null,
    };
  } catch (error) {
    console.error("Could not list Firebase Authentication users:", error);
    throw new HttpsError("internal", "No se pudo consultar Firebase Authentication.");
  }
});
