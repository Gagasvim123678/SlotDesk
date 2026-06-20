interface PageHeaderProps {
  email?: string;
  onAdminOpen?: () => void;
  onSignOut?: () => void;
}

export function PageHeader({ email, onAdminOpen, onSignOut }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <p>Онлайн-запись и расписание</p>
        <h1>SlotDesk</h1>
      </div>
      <div className="header-actions">
        {email && <small>{email}</small>}
        {onAdminOpen && <button onClick={onAdminOpen}>Администратор</button>}
        {onSignOut && <button onClick={onSignOut}>Выйти</button>}
      </div>
    </header>
  );
}
