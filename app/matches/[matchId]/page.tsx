import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LiveMatchDetails from '@/components/LiveMatchDetails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ matchId: string }> }): Promise<Metadata> {
  const { matchId } = await params;
  const { data: game } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (!game) {
    return {
      title: 'Partido no encontrado | Mundial 2026',
      description: 'El partido solicitado no existe o no esta disponible.',
    };
  }

  return {
    title: `${game.home_team.name} vs ${game.away_team.name} | Mundial 2026`,
    description: `Sigue en vivo el partido entre ${game.home_team.name} y ${game.away_team.name}. Resultados y estadísticas en directo.`,
    openGraph: {
      images: [game.home_team.image, game.away_team.image],
    },
  };
}

export default async function LiveMatchDetailsPage({ 
  params 
}: { 
  params: Promise<{ matchId: string }> // Definimos que params es una Promesa
}) {
  const { matchId } = await params;
  const { data: game } = await supabase
    .from('matches')
    .select('id')
    .eq('id', matchId)
    .single();

  if (!game) {
    notFound();
  }

  return (
    <main>
       <LiveMatchDetails matchId={matchId} />
    </main>
  );
}
