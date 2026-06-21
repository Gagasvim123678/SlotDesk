import { notificationNames, statusNames } from "../../../entities/appointment/model/constants";
import type { Appointment, NotificationStatus, VisitStatus } from "../../../entities/appointment/model/types";

interface AppointmentCardProps {
  item: Appointment;
  onStatusChange: (item: Appointment, status: VisitStatus) => void;
  onNotificationChange: (item: Appointment, status: NotificationStatus) => void;
  onRemove: (id: string) => void;
}

const statusList = Object.keys(statusNames) as VisitStatus[];

export function AppointmentCard({ item, onStatusChange, onNotificationChange, onRemove }: AppointmentCardProps) {
  return (
    <article className={`visit ${item.status}`}>
      <div className="visit-main">
        <div>
          <span>{statusNames[item.status]}</span>
          <strong>{item.clientName}</strong>
          <p>{item.service}</p>
        </div>
        <div className="visit-time">
          <b>{item.time}</b>
          <small>{item.date}</small>
        </div>
      </div>

      <dl className="visit-details">
        <div>
          <dt>Телефон</dt>
          <dd>{item.phone || "Не указан"}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{item.email || "Не указан"}</dd>
        </div>
        <div>
          <dt>Специалист</dt>
          <dd>{item.specialist || "Не назначен"}</dd>
        </div>
        <div>
          <dt>Длительность</dt>
          <dd>{item.duration} мин.</dd>
        </div>
        <div>
          <dt>SMS</dt>
          <dd>{notificationNames[item.notificationStatus]}</dd>
        </div>
      </dl>

      <p className="comment">{item.comment || "Комментарий не добавлен."}</p>

      <div className="sms-preview">
        SMS: {item.clientName}, запись на {item.service} подтверждена на {item.date} в {item.time}.
      </div>

      <div className="actions">
        {statusList.map((state) => (
          <button key={state} disabled={state === item.status} onClick={() => onStatusChange(item, state)}>
            {statusNames[state]}
          </button>
        ))}
        <button disabled={item.notificationStatus === "sent"} onClick={() => onNotificationChange(item, "sent")}>
          SMS отправлено
        </button>
        <button className="danger" onClick={() => onRemove(item.id)}>
          Удалить
        </button>
      </div>
    </article>
  );
}
