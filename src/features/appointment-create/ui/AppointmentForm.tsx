import { FormEvent } from "react";
import { countryCodes, services, specialists } from "../../../entities/appointment/model/constants";
import type { AppointmentDraft } from "../../../entities/appointment/model/types";
import { getMinVisitDate, normalizeDuration, normalizePhone } from "../model/formInput";

interface AppointmentFormProps {
  draft: AppointmentDraft;
  error: string;
  onChange: (draft: AppointmentDraft) => void;
  onSubmit: (event: FormEvent) => void;
}

export function AppointmentForm({ draft, error, onChange, onSubmit }: AppointmentFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel appointment-form" noValidate>
      <div>
        <span>Онлайн-запись</span>
        <h2>Выберите удобный слот</h2>
        <p>Клиент оставляет контакты, а администратор после входа подтверждает визит и готовит SMS-заготовку.</p>
      </div>

      <label>
        Клиент
        <input
          placeholder="Фамилия и имя"
          value={draft.clientName}
          onChange={(event) => onChange({ ...draft, clientName: event.target.value })}
          required
        />
      </label>

      <div className="phone-row">
        <label>
          Код страны
          <select value={draft.phoneCode} onChange={(event) => onChange({ ...draft, phoneCode: event.target.value })}>
            {countryCodes.map((country) => (
              <option key={`${country.label}-${country.code}`} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Телефон
          <input
            inputMode="numeric"
            maxLength={12}
            placeholder="9000000000"
            value={draft.phone}
            onChange={(event) => onChange({ ...draft, phone: normalizePhone(event.target.value) })}
            required
          />
        </label>
      </div>

      <label>
        Email
        <input
          type="email"
          placeholder="client@mail.ru"
          value={draft.email}
          onChange={(event) => onChange({ ...draft, email: event.target.value })}
        />
      </label>

      <label>
        Услуга
        <select value={draft.service} onChange={(event) => onChange({ ...draft, service: event.target.value })}>
          {services.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </label>

      <label>
        Специалист
        <select value={draft.specialist} onChange={(event) => onChange({ ...draft, specialist: event.target.value })}>
          {specialists.map((specialist) => (
            <option key={specialist}>{specialist}</option>
          ))}
        </select>
      </label>

      <div className="two">
        <label>
          Дата
          <input
            type="date"
            min={getMinVisitDate()}
            value={draft.date}
            onChange={(event) => onChange({ ...draft, date: event.target.value })}
            required
          />
        </label>
        <label>
          Время
          <input
            type="time"
            value={draft.time}
            onChange={(event) => onChange({ ...draft, time: event.target.value })}
            required
          />
        </label>
      </div>

      <label>
        Длительность
        <input
          type="number"
          min="15"
          step="15"
          value={draft.duration}
          onChange={(event) => onChange({ ...draft, duration: normalizeDuration(event.target.value) })}
        />
      </label>

      <label>
        Комментарий
        <textarea
          placeholder="Пожелания клиента или тема консультации"
          value={draft.comment}
          onChange={(event) => onChange({ ...draft, comment: event.target.value })}
        />
      </label>

      {error && <p className="form-error">{error}</p>}
      <button>Записаться</button>
    </form>
  );
}
