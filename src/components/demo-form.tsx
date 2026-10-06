"use client";

import { useRef, useState, type FormEvent } from "react";
import { demoSchema, services } from "@/lib/demo-schema";

type Errors = Record<string, string>;
export default function DemoForm() {
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const notice = useRef<HTMLParagraphElement>(null);

  function notify(text: string, ok = false) {
    setMessage(text); setSuccess(ok);
    requestAnimationFrame(() => notice.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    setErrors({}); setMessage(""); setSuccess(false);
    const fields = new FormData(form);
    const parsed = demoSchema.safeParse(Object.fromEntries(fields));
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      notify("Lütfen işaretli alanları kontrol edin.");
      return;
    }
    busy.current = true; setPending(true);
    try {
      const response = await fetch("/api/demo-requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(25_000),
      });
      const result = await response.json();
      if (response.status !== 201 || result.ok !== true || typeof result.id !== "string" || !result.id) {
        setErrors(result.errors ?? {});
        notify(typeof result.message === "string" ? result.message : "Talebiniz doğrulanamadı. Lütfen tekrar deneyin.");
        return;
      }
      form.reset();
      notify(`Demo talebiniz kaydedildi. Kayıt numaranız: ${result.id}. Bu değerlendirme demosunda e-posta gönderilmez.`, true);
    } catch {
      notify("Talebinizin kaydedildiği doğrulanamadı. Bilgileriniz korunuyor. Yeniden göndermeden önce bağlantınızı kontrol edin.");
    } finally { busy.current = false; setPending(false); }
  }

  const accessibility = (key: string) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });
  const fieldError = (key: string) => errors[key] && <span className="field-error" id={`${key}-error`}>{errors[key]}</span>;

  return <form onSubmit={submit} noValidate aria-busy={pending}>
    <fieldset disabled={pending}>
      <legend className="sr-only">Demo talebi bilgileri</legend>
      <div className="form-row">
        <div className="field"><label htmlFor="name">Adınız</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Ör. Deniz Örnek" {...accessibility("name")} />{fieldError("name")}</div>
        <div className="field"><label htmlFor="email">E-posta adresiniz</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="deniz@example.com" {...accessibility("email")} />{fieldError("email")}</div>
      </div>
      <div className="field"><label htmlFor="service">İlgilendiğiniz hizmet</label><select id="service" name="service" required defaultValue="" {...accessibility("service")}><option value="" disabled>Bir hizmet seçin</option>{services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>{fieldError("service")}</div>
      <div className="field"><label htmlFor="description">Nasıl bir çözüme ihtiyacınız var?</label><textarea id="description" name="description" required minLength={10} maxLength={2000} rows={5} placeholder="Barınağınızın kapasite takibi veya giriş / çıkış süreci için ihtiyacınızı anlatın." {...accessibility("description")} />{fieldError("description")}<span className="hint">10–2000 karakter.</span></div>
      <button className="button" type="submit" disabled={pending}>{pending ? "Gönderiliyor…" : "Demo talebini gönder"}</button>
    </fieldset>
    <p ref={notice} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true" className={`notice ${message ? (success ? "success" : "error") : ""}`}>{message}</p>
  </form>;
}
