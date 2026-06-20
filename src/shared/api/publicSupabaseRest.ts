import { supabaseConfig } from "./supabaseClient";

export const publicSupabaseRest = async <T,>(path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);

  headers.set("apikey", supabaseConfig.key);
  headers.set("Authorization", `Bearer ${supabaseConfig.key}`);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.method && options.method !== "GET" && !headers.has("Prefer")) {
    headers.set("Prefer", "return=minimal");
  }

  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      const keyType = supabaseConfig.key.startsWith("sb_publishable_")
        ? "publishable"
        : "legacy anon";
      throw new Error(
        `Supabase отклонил публичный ключ (${keyType}). Возьмите полный ключ из Settings -> API Keys текущего проекта и перезапустите Vite.`,
      );
    }

    throw new Error(text || `Ошибка Supabase: ${response.status}`);
  }

  return (text ? JSON.parse(text) : undefined) as T;
};
