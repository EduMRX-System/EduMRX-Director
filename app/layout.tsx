import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";

import "bootstrap-icons/font/bootstrap-icons.css";

import "leaflet/dist/leaflet.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import LanguageInitializer from "@/components/LanguageInitializer";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "EduMRX Director — Filial Boshqaruv Paneli | director.edumrx.uz",
  description:
    "EduMRX Director paneli — o'quv markaz direktori uchun to'liq boshqaruv tizimi. Guruhlar, o'qituvchilar, o'quvchilar, davomat, to'lovlar va moliyaviy hisobotlarni bitta paneldan nazorat qiling.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EduMRX Director",
  },
  keywords: [
    "EduMRX director panel",
    "o'quv markaz direktori",
    "filial boshqaruvi",
    "guruh boshqaruvi",
    "davomat nazorati",
    "to'lov hisoboti",
    "o'qituvchilar ro'yxati",
    "o'quvchilar boshqaruvi",
    "moliyaviy tahlil",
    "edumrx.uz",
  ],
  metadataBase: new URL("https://director.edumrx.uz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EduMRX Director — Filial Boshqaruv Paneli",
    description:
      "Guruhlar, davomat, to'lovlar va hisobotlar — hammasi bitta director panelida. director.edumrx.uz",
    type: "website",
    url: "https://director.edumrx.uz",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMRX Director — Filial Boshqaruv Paneli",
    description:
      "Guruhlar, davomat, to'lovlar va hisobotlar — hammasi bitta director panelida.",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeInitializer />
        <LanguageInitializer />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}