import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HalalSpots — халяль места в Астане",
  description: "Ищите отмеченные халяль-рестораны, кафе и магазины на интерактивной карте Астаны.",
  applicationName: "HalalSpots",
  openGraph: { title: "HalalSpots", description: "Халяль места на карте Астаны", type: "website", locale: "ru_KZ" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6f5ef" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
