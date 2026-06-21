import { statusFilterNames, statusOptions } from "../../../entities/appointment/model/constants";
import type { VisitStatus } from "../../../entities/appointment/model/types";

interface AppointmentToolbarProps {
  query: string;
  status: "all" | VisitStatus;
  date: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: "all" | VisitStatus) => void;
  onDateChange: (value: string) => void;
}

export function AppointmentToolbar({
  query,
  status,
  date,
  onQueryChange,
  onStatusChange,
  onDateChange,
}: AppointmentToolbarProps) {
  return (
    <div className="toolbar">
      <input
        placeholder="Поиск по клиенту, телефону, email или услуге"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select value={status} onChange={(event) => onStatusChange(event.target.value as "all" | VisitStatus)}>
        {statusOptions.map((item) => (
          <option key={item} value={item}>
            {statusFilterNames[item]}
          </option>
        ))}
      </select>
      <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} />
      <button type="button" onClick={() => onDateChange("")}>
        все даты
      </button>
    </div>
  );
}
