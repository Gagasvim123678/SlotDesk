import { statusNames } from "../../../entities/appointment/model/constants";
import type { Appointment } from "../../../entities/appointment/model/types";
import { getAppointmentStats } from "../model/getAppointmentStats";

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const stats = getAppointmentStats(appointments);

  return (
    <section className="stats">
      <article>
        <span>Сегодня</span>
        <strong>{stats.todayCount}</strong>
      </article>
      <article>
        <span>Активные</span>
        <strong>{stats.activeCount}</strong>
      </article>
      <article>
        <span>SMS к отправке</span>
        <strong>{stats.queuedSms}</strong>
      </article>
      <article>
        <span>{statusNames.done}</span>
        <strong>{stats.doneCount}</strong>
      </article>
    </section>
  );
}
