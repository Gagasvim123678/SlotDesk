import { countryCodes } from "./constants";
import { getTodayValue, isPastVisitTime } from "./dateUtils";
import type { AppointmentDraft, AppointmentSlot } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAppointmentDraft = (draft: AppointmentDraft, slots: AppointmentSlot[]) => {
  if (!draft.clientName.trim()) return "Введите имя клиента.";
  if (!draft.phone.trim()) return "Введите номер телефона.";

  const country = countryCodes.find((item) => item.code === draft.phoneCode);
  if (country && draft.phone.length !== country.phoneLength) {
    return `Для выбранного кода нужно указать ${country.phoneLength} цифр номера.`;
  }

  if (draft.email && !emailPattern.test(draft.email)) {
    return "Введите корректный email или оставьте поле пустым.";
  }

  if (!draft.date) return "Выберите дату записи.";
  if (draft.date < getTodayValue()) return "Нельзя создать запись на прошедшую дату.";
  if (!draft.time) return "Выберите время записи.";
  if (isPastVisitTime(draft.date, draft.time)) {
    return "На сегодня можно выбрать только будущее время.";
  }

  if (draft.duration < 15) return "Длительность должна быть не меньше 15 минут.";

  const hasSameSlot = slots.some(
    (slot) =>
      slot.date === draft.date &&
      slot.time.slice(0, 5) === draft.time &&
      slot.specialist === draft.specialist &&
      slot.status !== "cancelled",
  );

  if (hasSameSlot) {
    return "У этого специалиста уже есть запись на выбранные дату и время.";
  }

  return "";
};
