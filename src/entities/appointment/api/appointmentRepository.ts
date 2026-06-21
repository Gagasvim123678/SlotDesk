import type { SupabaseClient } from "@supabase/supabase-js";
import { publicSupabaseRest } from "../../../shared/api/publicSupabaseRest";
import { supabaseConfig } from "../../../shared/api/supabaseClient";
import type { Appointment, AppointmentDraft, AppointmentSlot, NotificationStatus, VisitStatus } from "../model/types";
import { fromAppointmentRow, toAppointmentRow } from "./appointmentMapper";

const getCreateErrorMessage = (error: unknown) => {
  const text = error instanceof Error ? error.message : String(error);

  if (text.includes("Supabase отклонил публичный ключ")) {
    return text;
  }

  if (text.includes("42501") || text.includes("row-level security")) {
    return "База данных не разрешила публичную запись. Примените обновленную схему Supabase.";
  }

  if (text.includes("23505") || text.includes("appointments_active_slot_unique_idx")) {
    return "Этот специалист уже занят в выбранные дату и время.";
  }

  return "Не удалось сохранить запись. Проверьте подключение к Supabase.";
};

const getAdminClient = async (accessToken: string): Promise<SupabaseClient> => {
  const { createClient } = await import("@supabase/supabase-js");

  if (!supabaseConfig.url || !supabaseConfig.key) {
    throw new Error("Supabase не настроен.");
  }

  return createClient(supabaseConfig.url, supabaseConfig.key, {
    auth: {
      storageKey: `slotdesk-admin-appointment-${crypto.randomUUID()}`,
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

const toSlot = (row: Record<string, unknown>): AppointmentSlot => ({
  id: String(row.id),
  service: String(row.service),
  specialist: String(row.specialist ?? ""),
  date: String(row.visit_date),
  time: String(row.visit_time),
  duration: Number(row.duration ?? 45),
  status: row.status as VisitStatus,
});

export const appointmentRepository = {
  async listSlots() {
    const rows = await publicSupabaseRest<Record<string, unknown>[]>(
      "appointment_slots?select=*&order=visit_date.asc,visit_time.asc",
    );

    return rows.map((row) => toSlot(row));
  },

  async list(accessToken: string) {
    const client = await getAdminClient(accessToken);
    const { data, error } = await client
      .from("appointments")
      .select("*")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => fromAppointmentRow(row));
  },

  async create(draft: AppointmentDraft) {
    const item: Appointment = {
      id: crypto.randomUUID(),
      ...draft,
      phone: `${draft.phoneCode} ${draft.phone}`,
      status: "new",
      notificationStatus: "not_sent",
      createdAt: new Date().toISOString(),
    };

    try {
      await publicSupabaseRest<void>("appointments", {
        method: "POST",
        body: JSON.stringify(toAppointmentRow(item)),
      });

      return item;
    } catch (error) {
      throw new Error(getCreateErrorMessage(error));
    }
  },

  async updateStatus(id: string, status: VisitStatus, accessToken: string) {
    const client = await getAdminClient(accessToken);
    const notificationStatus: NotificationStatus | undefined = status === "confirmed" ? "queued" : undefined;
    const { error } = await client
      .from("appointments")
      .update({
        status,
        ...(notificationStatus ? { notification_status: notificationStatus } : {}),
      })
      .eq("id", id);

    if (error) throw error;
  },

  async updateNotification(id: string, notificationStatus: NotificationStatus, accessToken: string) {
    const client = await getAdminClient(accessToken);
    const { error } = await client
      .from("appointments")
      .update({ notification_status: notificationStatus })
      .eq("id", id);

    if (error) throw error;
  },

  async remove(id: string, accessToken: string) {
    const client = await getAdminClient(accessToken);
    const { error } = await client.from("appointments").delete().eq("id", id);
    if (error) throw error;
  },
};
