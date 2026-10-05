import { z } from "zod";

export const services = [
  { value: "capacity", label: "Kapasite takibi" },
  { value: "check-in-out", label: "Giriş / çıkış yönetimi" },
  { value: "all", label: "Tüm modüller" },
] as const;

export const demoSchema = z.object({
  name: z.string().trim().min(2, "Adınız en az 2 karakter olmalı.").max(80, "Adınız en fazla 80 karakter olabilir."),
  email: z.string().trim().max(254, "E-posta en fazla 254 karakter olabilir.").pipe(z.email("Geçerli bir e-posta adresi girin.")),
  service: z.enum(["capacity", "check-in-out", "all"], { error: "Bir hizmet seçin." }),
  description: z.string().trim().min(10, "İhtiyacınızı en az 10 karakterle açıklayın.").max(2000, "Açıklama en fazla 2000 karakter olabilir."),
}).strict();

export type DemoRequest = z.infer<typeof demoSchema>;
