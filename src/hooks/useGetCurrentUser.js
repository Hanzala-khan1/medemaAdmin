import { auth } from "@/config/firebase";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "react-firebase-hooks/auth";

const fetchCurrentUser = async () => {
  const user = auth.currentUser;
  return user;
};

export const useCurrentUser = async () => {
  const [user, loading] = useAuthState(auth);

  return useQuery("currentUser", fetchCurrentUser, {
    enabled: !!user,
  });
};