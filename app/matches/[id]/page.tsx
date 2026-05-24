import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Metadata } from 'next';
import LiveMatchDetails from '@/components/LiveMatchDetails';
import { MatchGame } from '@/types/match';

// export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
//   const { id } = await params;

//   // Leemos el JSON para saber quién juega
//   const filePath = path.join(process.cwd(), 'data', 'games', `${id}.json`);
  
//   if (!fs.existsSync(filePath)) {
//     return { title: 'Partido No Encontrado - Mundial 2026' };
//   }

//   const fileContent = fs.readFileSync(filePath, 'utf8');
//   const { game } = JSON.parse(fileContent) as MatchGame;

//   return {
//     title: `${game.home_team.name} vs ${game.away_team.name} | Mundial 2026`,
//     description: `Sigue en vivo el partido entre ${game.home_team.name} y ${game.away_team.name}. Resultados y estadísticas en directo.`,
//     openGraph: {
//       images: [game.home_team.image, game.away_team.image],
//     },
//   };
// }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  });
}


export default async function LiveMatchPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Definimos que params es una Promesa
}) {
  // Aquí renderizas tu componente de cliente que maneja el "vivo" y los sonidos
  const { id } = await params;

  return (
    <main>
       <LiveMatchDetails matchId={id} />
    </main>
  );
}