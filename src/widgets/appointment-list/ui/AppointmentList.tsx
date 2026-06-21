import type { Appointment, NotificationStatus, VisitStatus } from "../../../entities/appointment/model/types";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (item: Appointment, status: VisitStatus) => void;
  onNotificationChange: (item: Appointment, status: NotificationStatus) => void;
  onRemove: (id: string) => void;
}

export function AppointmentList({
  appointments,
  onStatusChange,
  onNotificationChange,
  onRemove,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <section className="empty-list">
        <h2>Записей пока нет</h2>
        <p>Создайте первую заявку или измените фильтры расписания.</p>
      </section>
    );
  }

  return (
    <div className="list">
      {appointments.map((item) => (
        <AppointmentCard
          key={item.id}
          item={item}
          onStatusChange={onStatusChange}
          onNotificationChange={onNotificationChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
