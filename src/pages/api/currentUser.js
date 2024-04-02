import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default async function handler(req, res) {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          console.log("user here", user);
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });

    console.log("user id", user);

    if (user) {
      res.status(200).json({ uid: user.uid });
    } else {
      res.status(200).json({ email: null });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
