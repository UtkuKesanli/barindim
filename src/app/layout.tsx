import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barındım | Barınaklar için daha görünür kapasite",
  description: "Barınak kapasitesi, kabul süreci ve giriş / çıkış takibi için kurgusal yazılım hizmeti. Örnek paneli inceleyin, yazılım demosu talep edin.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>;
}
