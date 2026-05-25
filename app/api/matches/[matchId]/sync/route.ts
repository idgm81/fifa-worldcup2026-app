import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Usamos service_role para poder escribir
);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ matchId: string }> } 
) {
  // 1. Esperamos a que los params se resuelvan
  const { matchId } = await context.params;

  try {
    // 1. Obtener el api_id de este partido desde tu DB
    const { data: matchEntry } = await supabase
      .from('matches')
      .select('api_id')
      .eq('id', matchId)
      .single();

    if (!matchEntry?.api_id) {
      // Si no hay api_id aún, devolvemos lo que hay en DB sin actualizar
      const { data } = await supabase.from('matches').select('*').eq('id', matchId).single();
      return NextResponse.json({ game: data });
    }

    // 2. Llamada a Football API (Sustituye por tu endpoint real)
    const res = await fetch(`https://v3.football.api-sports.io/fixtures?id=${matchEntry.api_id}`, {
      headers: {
        'x-rapidapi-key': process.env.FOOTBALL_API_KEY || '',
        'x-rapidapi-host': 'v3.football.api-sports.io'
      }
    });
    const externalData = await res.json();
    const fixture = externalData.response[0];

    // 3. Mapeo de la API externa a TU esquema de base de datos
    const updatedData = {
      status: fixture.fixture.status.short.toLowerCase() === 'live' ? 'live' : 'finished',
      minute: fixture.fixture.status.elapsed,
      score: {
        home: fixture.goals.home,
        away: fixture.goals.away
      },
      stats: {
        possession: { 
            home: parseInt(fixture.statistics[0]?.statistics.find((s: any) => s.type === "Ball Possession")?.value) || 50,
            away: parseInt(fixture.statistics[1]?.statistics.find((s: any) => s.type === "Ball Possession")?.value) || 50
        },
        shots: {
            home: fixture.statistics[0]?.statistics.find((s: any) => s.type === "Total Shots")?.value || 0,
            away: fixture.statistics[1]?.statistics.find((s: any) => s.type === "Total Shots")?.value || 0
        }
      },
      // ... mapear eventos y alineaciones aquí ...
      updated_at: new Date().toISOString()
    };

    // 4. Guardar en Supabase (Upsert)
    const { data: finalMatch, error } = await supabase
      .from('matches')
      .update(updatedData)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ game: `Sync completado para ${finalMatch.id}` });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}