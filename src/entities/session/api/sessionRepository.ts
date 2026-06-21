import { createClient } from "@supabase/supabase-js";
import { supabase, supabaseConfig } from "../../../shared/api/supabaseClient";
import type { AdminSession } from "../model/types";

const STORAGE_KEY = "slotdesk-admin-session-v3";

const getAuthErrorMessage = (error: unknown) => {
  const text = error instanceof Error ? error.message : String(error);

  if (text.includes("Invalid login credentials")) {
    return "Неверный email или пароль.";
  }

  if (text.includes("Email not confirmed")) {
    return "Email администратора не подтвержден.";
  }

  if (text.includes("Этот аккаунт")) {
    return text;
  }

  return "Не удалось войти. Проверьте данные администратора и попробуйте еще раз.";
};

const createAuthorizedClient = (accessToken: string) => {
  if (!supabaseConfig.url || !supabaseConfig.key) {
    throw new Error("Supabase не настроен.");
  }

  return createClient(supabaseConfig.url, supabaseConfig.key, {
    auth: {
      storageKey: `slotdesk-admin-check-${crypto.randomUUID()}`,
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

const assertAdminAccess = async (session: AdminSession) => {
  const client = createAuthorizedClient(session.accessToken);
  const { data, error } = await client.from("app_admin").select("user_id").eq("user_id", session.user.id);

  if (error) throw error;
  if (!data?.length) {
    throw new Error("Этот аккаунт не назначен администратором.");
  }
};

const saveSession = (session: AdminSession) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("slotdesk-admin-session");
  localStorage.removeItem("slotdesk-admin-session-v2");
};

export const sessionRepository = {
  getStoredSession() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw) as AdminSession;
      const isExpired = !session.accessToken || session.expiresAt <= Date.now();

      if (isExpired) {
        clearSession();
        return null;
      }

      return session;
    } catch {
      clearSession();
      return null;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session || !data.user) throw new Error("Не удалось получить сессию администратора.");

      const session: AdminSession = {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: Date.now() + data.session.expires_in * 1000,
        user: {
          id: data.user.id,
          email: data.user.email ?? email,
        },
      };

      await assertAdminAccess(session);
      saveSession(session);

      return session;
    } catch (error) {
      clearSession();
      throw new Error(getAuthErrorMessage(error));
    }
  },

  signOut() {
    clearSession();
  },
};
