import { auth } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
  const { email, password } = req.body;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}
