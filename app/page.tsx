import { createClient } from '@supabase/supabase-js';
import CardMatch from '@/components/CardMatch';
import AdSenseBanner from '@/components/AdSenseBanner';

export const metadata = {
  title: 'Copa Mundial FIFA 2026 | Resultados, Partidos y Estadísticas en Vivo',
  description: 'Sigue todos los resultados, horarios y clasificaciones de la Copa Mundial FIFA 2026. Actualizaciones al instante y las mejores ofertas en camisetas de tus selecciones favoritas.',
  keywords: 'mundial 2026, resultados fifa 2026, partidos mundial, comprar camisetas mundial, mexico 2026, usa 2026, canada 2026',

  // Configuración de OpenGraph
  openGraph: {
    title: 'Copa Mundial FIFA 2026 | Calendario y Resultados',
    description: 'Sigue todos los resultados, horarios y clasificaciones de la Copa Mundial FIFA 2026. Actualizaciones al instante y las mejores ofertas en camisetas de tus selecciones favoritas.',
    url: 'https://fifa-worldcup2026-app.vercel.app/',
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getMatches() {
  const now = new Date().toISOString();
  
  // 1. Buscamos partidos EN VIVO o de HOY
  // 2. Si no hay, traemos solo los 3 siguientes

  const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .or(`status.eq.live, scheduled_at.gte.${now}`)
      .order('scheduled_at', { ascending: true })
      .limit(3);

  return matches || [];
}

export default async function HomePage() {
  const matches = await getMatches();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
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
            Vive la Copa Mundial FIFA 2026
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light">
            Resultados y clasificacion actualizados en vivo
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

        <AdSenseBanner slot="6930181525" />

        {/* Partidos Section */}
        <section id="partidos" className="mb-12">
          <h2 className="text-3xl font-bold border-b-4 border-blue-900 pb-2 inline-block mb-8">Próximos Partidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((game, index) => (
              <CardMatch key={index} game={game} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}