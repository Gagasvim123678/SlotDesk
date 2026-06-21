import { useState } from "react";
import { sessionRepository } from "../../../entities/session/api/sessionRepository";
import type { AdminSession } from "../../../entities/session/model/types";

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => sessionRepository.getStoredSession());
  const [authError, setAuthError] = useState("");

  const signIn = async (email: string, password: string) => {
    try {
      setAuthError("");
      const nextSession = await sessionRepository.signIn(email, password);
      setSession(nextSession);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось войти.";
      setAuthError(message);
    }
  };

  const signOut = () => {
    sessionRepository.signOut();
    setSession(null);
    setAuthError("");
  };

  return {
    session,
    authError,
    signIn,
    signOut,
  };
}
