import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";

import supabase from "./supabase";

const AuthContext = React.createContext<Session | null>(null);

export function useAuthContext() {
  if (!React.useContext(AuthContext)) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        AsyncStorage.setItem("session", JSON.stringify(session));
      } else {
        AsyncStorage.removeItem("session");
      }
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const router = useRouter();

  React.useEffect(() => {
    async function init() {
      const session = await AsyncStorage.getItem("session");
      if (session) {
        const { error } = await supabase.auth.setSession(JSON.parse(session));
        if (error) {
          // TODO: log to a logging service that an error occurred while setting the session
          router.replace("/auth/login");
        } else {
          router.replace("/home");
        }
      } else {
        router.replace("/auth/login");
      }
    }

    init();
  }, [router]);
}
