import { useAuth } from "./common/auth";

export default function Index() {
  // When the app starts, we want to check if the user is logged in.
  useAuth();
  return null;
}
