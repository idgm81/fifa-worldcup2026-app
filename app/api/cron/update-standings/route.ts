import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verificación de seguridad opcional (ej: un token secreto en la URL)
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // 1. Obtener todos los partidos finalizados
    const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'finished')
        .not('group', 'is', null); // Solo partidos que tengan un grupo asignado

    if (!matches) return NextResponse.json({ message: 'Sin partidos finalizados' });

    // 2. Obtener todos los equipos para resetear sus stats antes de recalcular
    const { data: teams } = await supabase.from('groups').select('*');
    const stats: Record<string, any> = {};

    teams?.forEach(t => {
      stats[t.team_name] = { 
        played: 0, won: 0, drawn: 0, lost: 0, 
        goals_for: 0, goals_against: 0, points: 0 
      };
    });

    // 3. Procesar cada partido
    matches.forEach(m => {
      const home = m.home_team.name;
      const away = m.away_team.name;
      const scoreHome = m.score.home;
      const scoreAway = m.score.away;

      if (stats[home] && stats[away]) {
        stats[home].played++;
        stats[away].played++;
        stats[home].goals_for += scoreHome;
        stats[home].goals_against += scoreAway;
        stats[away].goals_for += scoreAway;
        stats[away].goals_against += scoreHome;

        if (scoreHome > scoreAway) {
          stats[home].won++;
          stats[home].points += 3;
          stats[away].lost++;
        } else if (scoreHome < scoreAway) {
          stats[away].won++;
          stats[away].points += 3;
          stats[home].lost++;
        } else {
          stats[home].drawn++;
          stats[away].drawn++;
          stats[home].points += 1;
          stats[away].points += 1;
        }
      }
    });

    // 4. Actualizar la base de datos
    for (const teamName of Object.keys(stats)) {
      await supabase
        .from('groups')
        .update(stats[teamName])
        .eq('team_name', teamName);
    }

    return NextResponse.json({ success: true, updated: Object.keys(stats).length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}