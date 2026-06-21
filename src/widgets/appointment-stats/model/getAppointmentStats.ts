import { getTodayValue } from "../../../entities/appointment/model/dateUtils";
import type { Appointment, VisitStatus } from "../../../entities/appointment/model/types";

export const getAppointmentStats = (appointments: Appointment[]) => {
  const today = getTodayValue();
  const statusCount = (status: VisitStatus) => appointments.filter((item) => item.status === status).length;

  return {
    todayCount: appointments.filter((item) => item.date === today).length,
    activeCount: appointments.filter((item) => item.status === "new" || item.status === "confirmed").length,
    queuedSms: appointments.filter((item) => item.notificationStatus === "queued").length,
    doneCount: statusCount("done"),
  };
};
