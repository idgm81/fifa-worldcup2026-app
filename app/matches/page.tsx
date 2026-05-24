import { createClient } from '@supabase/supabase-js';
import CardMatch from '@/components/CardMatch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function getAllMatches() {
  const { data: allMatches } = await supabase
    .from('matches')
    .select('*')
    .order('scheduled_at', { ascending: true });

  // Agrupamos los partidos por fecha para que sea más fácil de leer
  const grouped = allMatches?.reduce((acc: any, match) => {
    const date = new Date(match.scheduled_at).toLocaleDateString('es-ES', { 
      weekday: 'long', day: 'numeric', month: 'long' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto p-6 py-10">
      <h1 className="text-3xl font-black mb-10 border-b pb-4">Calendario de Partidos</h1>
      
      {Object.keys(grouped).map((date) => (
        <section key={date} className="mb-12">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-6 sticky top-20 bg-gray-50/90 backdrop-blur py-2 z-10">
            {date}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {grouped[date].map((game: any) => (
              <CardMatch key={game.id} game={game} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}