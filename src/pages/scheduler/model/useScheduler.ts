import { FormEvent, useEffect, useMemo, useState } from "react";
import { appointmentRepository } from "../../../entities/appointment/api/appointmentRepository";
import { emptyAppointmentDraft } from "../../../entities/appointment/model/constants";
import { filterAppointments, getPublicSlots } from "../../../entities/appointment/model/appointmentSelectors";
import { validateAppointmentDraft } from "../../../entities/appointment/model/appointmentValidation";
import { sortByVisitStart } from "../../../entities/appointment/model/dateUtils";
import type {
  Appointment,
  AppointmentDraft,
  AppointmentSlot,
  NotificationStatus,
  VisitStatus,
} from "../../../entities/appointment/model/types";

export function useScheduler(accessToken?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | VisitStatus>("all");
  const [date, setDate] = useState("");
  const [draft, setDraft] = useState<AppointmentDraft>(emptyAppointmentDraft);
  const [formError, setFormError] = useState("");

  const refreshSlots = async () => {
    const nextSlots = await appointmentRepository.listSlots();
    setSlots(nextSlots);
  };

  useEffect(() => {
    refreshSlots().catch(() => setSlots([]));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setAppointments([]);
      return;
    }

    appointmentRepository.list(accessToken).then(setAppointments).catch(() => setAppointments([]));
  }, [accessToken]);

  const filteredAppointments = useMemo(
    () => filterAppointments(appointments, { query, status, date }),
    [appointments, date, query, status],
  );

  const visibleSlots = useMemo(() => getPublicSlots(slots), [slots]);

  const addAppointment = async (event: FormEvent) => {
    event.preventDefault();
    const error = validateAppointmentDraft(draft, slots);

    if (error) {
      setFormError(error);
      return;
    }

    try {
      setFormError("");
      const created = await appointmentRepository.create(draft);
      await refreshSlots().catch(() => undefined);

      if (accessToken) {
        setAppointments((current) => sortByVisitStart([...current, created]));
      }

      setDraft(emptyAppointmentDraft);
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Не удалось сохранить запись.");
    }
  };

  const changeStatus = async (item: Appointment, nextStatus: VisitStatus) => {
    if (!accessToken) return;

    await appointmentRepository.updateStatus(item.id, nextStatus, accessToken);
    await refreshSlots().catch(() => undefined);
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === item.id
          ? {
              ...appointment,
              status: nextStatus,
              notificationStatus: nextStatus === "confirmed" ? "queued" : appointment.notificationStatus,
            }
          : appointment,
      ),
    );
  };

  const changeNotification = async (item: Appointment, notificationStatus: NotificationStatus) => {
    if (!accessToken) return;

    await appointmentRepository.updateNotification(item.id, notificationStatus, accessToken);
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === item.id ? { ...appointment, notificationStatus } : appointment)),
    );
  };

  const removeAppointment = async (id: string) => {
    if (!accessToken) return;

    await appointmentRepository.remove(id, accessToken);
    await refreshSlots().catch(() => undefined);
    setAppointments((current) => current.filter((appointment) => appointment.id !== id));
  };

  return {
    appointments,
    filteredAppointments,
    slots: visibleSlots,
    query,
    status,
    date,
    draft,
    formError,
    setQuery,
    setStatus,
    setDate,
    setDraft,
    addAppointment,
    changeStatus,
    changeNotification,
    removeAppointment,
  };
}
