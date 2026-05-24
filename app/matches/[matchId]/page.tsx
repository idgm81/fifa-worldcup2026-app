import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Metadata } from 'next';
import LiveMatchDetails from '@/components/LiveMatchDetails';

export async function generateMetadata({ params }: { params: Promise<{ matchId: string }> }): Promise<Metadata> {
  const { matchId } = await params;

  const { data: game, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  return {
    title: `${game.home_team.name} vs ${game.away_team.name} | Mundial 2026`,
    description: `Sigue en vivo el partido entre ${game.home_team.name} y ${game.away_team.name}. Resultados y estadísticas en directo.`,
    openGraph: {
      images: [game.home_team.image, game.away_team.image],
    },
  };
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  });
}


export default async function LiveMatchDetailsPage({ 
  params 
}: { 
  params: Promise<{ matchId: string }> // Definimos que params es una Promesa
}) {
  // Aquí renderizas tu componente de cliente que maneja el "vivo" y los sonidos
  const { matchId } = await params;

  return (
    <main>
       <LiveMatchDetails matchId={matchId} />
    </main>
  );
}