import type { AppointmentDraft, NotificationStatus, VisitStatus } from "./types";

export const countryCodes = [
  { code: "+7", label: "Россия +7", phoneLength: 10 },
  { code: "+375", label: "Беларусь +375", phoneLength: 9 },
  { code: "+380", label: "Украина +380", phoneLength: 9 },
  { code: "+7", label: "Казахстан +7", phoneLength: 10 },
  { code: "+998", label: "Узбекистан +998", phoneLength: 9 },
];

export const services = [
  "Первичная консультация",
  "Повторная консультация",
  "Диагностика",
  "Оформление документов",
  "Онлайн-встреча",
];

export const specialists = ["Любой специалист", "Консультант", "Специалист поддержки", "Менеджер"];

export const statusNames: Record<VisitStatus, string> = {
  new: "Заявка",
  confirmed: "Подтверждена",
  done: "Завершена",
  cancelled: "Отменена",
};

export const notificationNames: Record<NotificationStatus, string> = {
  not_sent: "SMS не отправлено",
  queued: "SMS подготовлено",
  sent: "SMS отправлено",
};

export const statusOptions: Array<"all" | VisitStatus> = ["all", "new", "confirmed", "done", "cancelled"];

export const statusFilterNames: Record<"all" | VisitStatus, string> = {
  all: "Все статусы",
  ...statusNames,
};

export const emptyAppointmentDraft: AppointmentDraft = {
  clientName: "",
  phoneCode: countryCodes[0].code,
  phone: "",
  email: "",
  service: services[0],
  specialist: specialists[0],
  date: "",
  time: "",
  duration: 45,
  comment: "",
};
