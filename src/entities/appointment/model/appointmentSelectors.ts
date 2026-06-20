import type { Appointment, AppointmentSlot, VisitStatus } from "./types";

interface AppointmentFilter {
  query: string;
  status: "all" | VisitStatus;
  date: string;
}

const getSearchText = (item: Appointment) =>
  `${item.clientName} ${item.phone} ${item.email} ${item.service} ${item.specialist} ${item.comment}`.toLowerCase();

export const filterAppointments = (appointments: Appointment[], filter: AppointmentFilter) => {
  const query = filter.query.toLowerCase();

  return appointments.filter((item) => {
    const byText = getSearchText(item).includes(query);
    const byStatus = filter.status === "all" || item.status === filter.status;
    const byDate = !filter.date || item.date === filter.date;

    return byText && byStatus && byDate;
  });
};

export const getPublicSlots = (slots: AppointmentSlot[]) =>
  slots.filter((slot) => slot.status !== "cancelled").slice(0, 8);
