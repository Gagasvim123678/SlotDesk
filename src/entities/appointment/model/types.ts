export type VisitStatus = "new" | "confirmed" | "done" | "cancelled";
export type NotificationStatus = "not_sent" | "queued" | "sent";

export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  duration: number;
  comment: string;
  status: VisitStatus;
  notificationStatus: NotificationStatus;
  createdAt: string;
}

export interface AppointmentSlot {
  id: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  duration: number;
  status: VisitStatus;
}

export interface AppointmentDraft {
  clientName: string;
  phoneCode: string;
  phone: string;
  email: string;
  service: string;
  specialist: string;
  date: string;
  time: string;
  duration: number;
  comment: string;
}
