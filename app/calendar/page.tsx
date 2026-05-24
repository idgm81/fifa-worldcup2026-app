import { createClient } from '@supabase/supabase-js';
import CardMatch from '@/components/CardMatch';
import FechaLocal from '@/components/FechaLocal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CalendarPage() {
  // 1. Traemos todos los partidos ordenados por fecha
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .order('scheduled_at', { ascending: true });

  if (error) return <div className="p-10 text-center text-red-500">Error al cargar el calendario.</div>;

  // 2. Agrupamos los partidos por día (YYYY-MM-DD)
  const groupedMatches = matches.reduce((acc: any, match: any) => {
    const date = match.scheduled_at.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 animate-in fade-in duration-700">
      {/* Cabecera estilo Home */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('/patterns/stadium.svg')] bg-cover"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Calendario de Partidos</h1>
        </div>
      </section>

      <div className="space-y-16">
        {groupedMatches && Object.keys(groupedMatches).map((date) => (
          <section key={date} className="relative">
            {/* 🟢 LA FECHA STICKY CORREGIDA */}
            {/* top-20 porque el header del layout mide 20 (80px) */}
            <div className="sticky top-20 z-30 bg-gray-50/90 backdrop-blur-sm py-4 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-200">
                  <span className="text-xs font-bold uppercase leading-none opacity-80">Jun</span>
                  <span className="text-xl font-black leading-none">{date.split('-')[2]}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800">
                    <FechaLocal date={date} showTime={false} />
                  </h2>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Fase de Grupos</p>
                </div>
              </div>
            </div>

            {/* Grid de Partidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMatches[date].map((match: any) => (
                <CardMatch key={match.id} game={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}