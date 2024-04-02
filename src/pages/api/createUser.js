import initializeFirebaseServer from './firebaseServer';

// Initialize Firebase Admin SDK
const admin = initializeFirebaseServer();

export default async function createUser(req, res) {
  console.log("reachedddd")
  if (req.method === 'POST') {
    try {
      const { name, email, password, role } = req.body;

      // Create the user with email and password
      const userRecord = await admin.auth().createUser({
        name,
        email,
        role,
        password,
      });

      // Set custom claims for the user to assign roles
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
}
