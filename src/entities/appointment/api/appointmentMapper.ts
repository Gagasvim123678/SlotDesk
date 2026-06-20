import type { Appointment, NotificationStatus, VisitStatus } from "../model/types";

export const fromAppointmentRow = (row: Record<string, unknown>): Appointment => ({
  id: String(row.id),
  clientName: String(row.client_name),
  phone: String(row.phone ?? ""),
  email: String(row.email ?? ""),
  service: String(row.service),
  specialist: String(row.specialist ?? ""),
  date: String(row.visit_date),
  time: String(row.visit_time),
  duration: Number(row.duration ?? 45),
  comment: String(row.comment ?? ""),
  status: row.status as VisitStatus,
  notificationStatus: (row.notification_status ?? "not_sent") as NotificationStatus,
  createdAt: String(row.created_at),
});

export const toAppointmentRow = (item: Appointment) => ({
  id: item.id,
  client_name: item.clientName,
  phone: item.phone,
  email: item.email,
  service: item.service,
  specialist: item.specialist,
  visit_date: item.date,
  visit_time: item.time,
  duration: item.duration,
  comment: item.comment,
  status: item.status,
  notification_status: item.notificationStatus,
  created_at: item.createdAt,
});
