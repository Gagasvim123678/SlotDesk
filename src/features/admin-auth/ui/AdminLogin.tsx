import { FormEvent, useState } from "react";

interface AdminLoginProps {
  error: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AdminLogin({ error, onSubmit }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await onSubmit(email, password);
    setIsSubmitting(false);
  };

  return (
    <section className="panel admin-login">
      <div>
        <span>Панель администратора</span>
        <h2>Вход для управления записями</h2>
        <p>Клиентская форма доступна всем, а список заявок и статусы открываются после входа.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            autoComplete="email"
            placeholder="admin@mail.ru"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Пароль
          <input
            autoComplete="current-password"
            placeholder="Введите пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? "Проверяем..." : "Войти"}</button>
      </form>
    </section>
  );
}
