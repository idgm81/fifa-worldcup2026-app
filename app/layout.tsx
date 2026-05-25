import './globals.css';
import Link from 'next/link';
import { IoCalendarOutline, IoTrophyOutline, IoHomeOutline, IoShuffleOutline } from "react-icons/io5";
import type { Metadata } from "next";
import Script from 'next/script';
import { Geist, Geist_Mono } from "next/font/google";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="adsbygoogle-init"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7499038462295597"
          crossOrigin="anonymous"
          strategy="lazyOnload" // Carga el anuncio después de que la página sea interactiva
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Header Global */}
        <header className="sticky top-0 z-50 bg-blue-900 border-b border-blue-800 shadow-lg">
          <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
            {/* Logo y Título */}
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/copa-mundo.png" alt="FIFA World Cup Trophy" className="w-10 h-10 object-contain drop-shadow-md" />
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">
                Copa FIFA Mundial <span className="text-blue-400">2026</span>
              </h1>
            </Link>

            {/* Navegación */}
            <nav className="flex items-center gap-8">
              <NavLink href="/" icon={<IoHomeOutline />} label="Inicio" />
              <NavLink href="/calendar" icon={<IoCalendarOutline />} label="Partidos" />
              <NavLink href="/standings" icon={<IoTrophyOutline />} label="Grupos" />
              <NavLink href="/bracket" icon={<IoShuffleOutline />} label="Fase Final" />
            </nav>
          </div>
        </header>

        <main className="min-h-screen pb-20">
          {children}
        </main>

        <footer className="bg-gray-900 border-t border-gray-100 py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
          &copy; 2026
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-sm font-extrabold text-blue-100 hover:text-white transition-all duration-300 group relative py-2"
    >
      <span className="text-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <span className="hidden md:inline uppercase tracking-tight">
        {label}
      </span>
      
      {/* Línea decorativa: Ahora en azul claro para que resalte */}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}