import type { AppointmentSlot } from "../../../entities/appointment/model/types";

interface PublicScheduleProps {
  slots: AppointmentSlot[];
  onAdminOpen: () => void;
}

export function PublicSchedule({ slots, onAdminOpen }: PublicScheduleProps) {
  return (
    <section className="panel public-schedule">
      <div className="schedule-heading">
        <div>
          <span>Расписание</span>
          <h2>Занятые слоты</h2>
          <p>Перед отправкой заявки проверьте ближайшие занятые даты и время.</p>
        </div>
        <button type="button" onClick={onAdminOpen}>
          Для администратора
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="empty-list compact">
          <h2>Свободно</h2>
          <p>Пока нет занятых слотов. Можно выбрать удобное время.</p>
        </div>
      ) : (
        <div className="slot-list">
          {slots.map((slot) => (
            <article key={slot.id} className="slot-card">
              <strong>{slot.date}</strong>
              <b>{slot.time.slice(0, 5)}</b>
              <span>{slot.specialist}</span>
              <p>{slot.service}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
