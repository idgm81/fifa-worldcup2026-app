import type { Metadata } from "next";
import Script from 'next/script';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Copa Mundial FIFA 2026 - Resultados, Calendario y Dónde Ver los partidos",
  description: "Consulta el calendario oficial del Mundial FIFA 2026, horarios para España, estadios y canales de TV para ver los partidos en directo.",
  keywords: ["Mundial 2026", "Calendario Mundial 2026", "Dónde ver el mundial", "Resultados fútbol en vivo", "FIFA World Cup 2026"],
  authors: [{ name: "idgm1981" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7499038462295597"
          crossOrigin="anonymous"
          strategy="lazyOnload" // Carga el anuncio después de que la página sea interactiva
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
