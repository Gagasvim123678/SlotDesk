import { useState } from "react";
import { AdminLogin } from "../../../features/admin-auth/ui/AdminLogin";
import { AppointmentForm } from "../../../features/appointment-create/ui/AppointmentForm";
import { AppointmentToolbar } from "../../../features/appointment-filter/ui/AppointmentToolbar";
import { AppointmentList } from "../../../widgets/appointment-list/ui/AppointmentList";
import { AppointmentStats } from "../../../widgets/appointment-stats/ui/AppointmentStats";
import { PageHeader } from "../../../widgets/page-header/ui/PageHeader";
import { PublicSchedule } from "../../../widgets/public-schedule/ui/PublicSchedule";
import { useAdminSession } from "../model/useAdminSession";
import { useScheduler } from "../model/useScheduler";

export function SchedulerPage() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const admin = useAdminSession();
  const scheduler = useScheduler(admin.session?.accessToken);

  return (
    <main className="page">
      <PageHeader
        email={admin.session?.user.email}
        onAdminOpen={!admin.session ? () => setShowAdminLogin((value) => !value) : undefined}
        onSignOut={admin.session ? admin.signOut : undefined}
      />

      {admin.session && <AppointmentStats appointments={scheduler.appointments} />}

      <section className="layout">
        <AppointmentForm
          draft={scheduler.draft}
          error={scheduler.formError}
          onChange={scheduler.setDraft}
          onSubmit={scheduler.addAppointment}
        />

        <section className="content">
          {admin.session ? (
            <>
              <AppointmentToolbar
                query={scheduler.query}
                status={scheduler.status}
                date={scheduler.date}
                onQueryChange={scheduler.setQuery}
                onStatusChange={scheduler.setStatus}
                onDateChange={scheduler.setDate}
              />
              <AppointmentList
                appointments={scheduler.filteredAppointments}
                onStatusChange={scheduler.changeStatus}
                onNotificationChange={scheduler.changeNotification}
                onRemove={scheduler.removeAppointment}
              />
            </>
          ) : showAdminLogin ? (
            <AdminLogin error={admin.authError} onSubmit={admin.signIn} />
          ) : (
            <PublicSchedule slots={scheduler.slots} onAdminOpen={() => setShowAdminLogin(true)} />
          )}
        </section>
      </section>
    </main>
  );
}
