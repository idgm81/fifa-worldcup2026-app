import Head from 'next/head';
import Image from 'next/image';
import CardMatch from '@/components/CardMatch';
import AdUnit from '@/components/AdUnit';
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Copa Mundial FIFA 2026 | Resultados, Partidos y Estadísticas en Vivo',
  description: 'Sigue todos los resultados, horarios y clasificaciones de la Copa Mundial FIFA 2026. Actualizaciones al instante y las mejores ofertas en camisetas de tus selecciones favoritas.',
  keywords: 'mundial 2026, resultados fifa 2026, partidos mundial, comprar camisetas mundial, mexico 2026, usa 2026, canada 2026',

  // Configuración de OpenGraph
  openGraph: {
    title: "Copa Mundial FIFA 2026 | Calendario y Resultados",
    description: 'Sigue todos los resultados, horarios y clasificaciones de la Copa Mundial FIFA 2026. Actualizaciones al instante y las mejores ofertas en camisetas de tus selecciones favoritas.',
    url: 'https://tu-web-en-vercel.vercel.app',
    siteName: 'Calendario y Resultados Copa Mundial FIFA 2026',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
        alt: 'Estadios del Mundial 2026',
      },
      {
        url: '/copa-mundo.png',
        width: 400,
        height: 400,
        alt: 'Trofeo FIFA World Cup',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },

  // Configuración específica para Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: 'Calendario y Resultados Copa Mundial FIFA 2026',
    description: 'Sigue todos los resultados, horarios y clasificaciones de la Copa Mundial FIFA 2026. Actualizaciones al instante y las mejores ofertas en camisetas de tus selecciones favoritas.',
    images: ['/hero-bg.png'], // Imagen que se verá en grande al tuitear
  },
};

async function getMatches() {
  // path.join(process.cwd(), 'data', 'matches') apunta a la raíz del proyecto
  const matchesDirectory = path.join(process.cwd(), 'data', 'matches');

  try {
    // 1. Verificar si la carpeta existe
    if (!fs.existsSync(matchesDirectory)) {
      console.error("❌ Error: La carpeta /data/matches no existe en la raíz.");
      return [];
    }

    // 2. Leer los nombres de los archivos
    const filenames = fs.readdirSync(matchesDirectory);

    // 3. Procesar cada archivo
    const matches = filenames
      .filter((filename) => filename.endsWith('.json')) // Evitar archivos basura como .DS_Store
      .map((filename) => {
        const filePath = path.join(matchesDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
      });

    // 4. Ordenar cronológicamente (usando el startDate del Schema)
    return matches.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  } catch (error) {
    console.error("❌ Error leyendo los archivos JSON:", error);
    return [];
  }
}

export default async function Home() {
  const allMatches = await getMatches();
  const nextMatches = allMatches.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Header / Nav */}
      <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <img 
            src="/copa-mundo.png" 
            alt="FIFA World Cup Trophy" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight">Copa Mundial FIFA 2026</h1>
          <nav className="hidden md:flex space-x-6 font-medium">
            <a href="#partidos" className="hover:text-blue-300 transition">Partidos</a>
            <a href="#grupos" className="hover:text-blue-300 transition">Grupos</a>
            <a href="#tienda" className="hover:text-blue-300 transition text-yellow-400">Tienda</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: "url('/hero-bg.png')", // Tu imagen en la carpeta public
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay: Capa oscura para que el texto sea legible sobre la imagen */}
        <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]"></div>
        <div className="relative z-20 text-center text-white p-6 max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 uppercase drop-shadow-lg">
            No te pierdas nada de la Copa Mundial FIFA 2026
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Resultados al minuto, clasificacion y estadísticas
          </p>
          <a href="#partidos" className="bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition transform hover:scale-105">
            Ver Partidos de Hoy
          </a>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-full h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48V0h1200v120z" fill="#f9fafb"></path>
          </svg>
        </div>
      </section>

      <main className="container mx-auto p-4 md:p-8">
        
        {/* Ad Banner - Monetización */}

        <div 
        id="tienda"
        className="relative overflow-hidden rounded-3xl shadow-2xl border-2 border-yellow-500/30 group mb-16"
        style={{
          backgroundImage: "url('/store.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent transition-opacity group-hover:opacity-95" />
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:pr-6">
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Patrocinado</span>
              <h3 className="text-2xl font-bold mt-1">¿Listo para apoyar a tu selección?</h3>
              <p className="text-gray-300 mt-2">Consigue las equipaciones oficiales del Mundial con gastos de envío <strong>GRATIS</strong> en pedidos superiores a 75€</p>
            </div>
            <a href="https://camisetasfutbolymas.com/futbol/mundial/" target="_blank" rel="noopener noreferrer sponsored" className="shrink-0 bg-white text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg">
              Ver Camisetas
            </a>
          </div>
        </div>

        <AdUnit slot="6930181525" />

        {/* Partidos Section */}
        <section id="partidos" className="mb-12">
          <h2 className="text-3xl font-bold border-b-4 border-blue-900 pb-2 inline-block mb-8">Próximos Partidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextMatches.map((partido, index) => (
              <CardMatch key={index} partido={partido} />
            ))}
          </div>
        </section>

      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <p>&copy; 2026</p>
      </footer>
    </div>
  );
}