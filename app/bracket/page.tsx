// app/bracket/page.tsx
import { createClient } from '@supabase/supabase-js';
import TeamImage from "@/components/TeamImage";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BracketPage() {
  const { data: allMatches } = await supabase
    .from('matches')
    .select('*')
    .not('group', 'ilike', '%Grupo%')
    .order('scheduled_at', { ascending: true });


  // 2. Organizamos los partidos por su identificador de fase
  const rounds = {
    r32: allMatches?.filter(m => m.group === 'Dieciseisavos de final') || [],
    r16: allMatches?.filter(m => m.group === 'Octavos de final') || [],
    qf: allMatches?.filter(m => m.group === 'Cuartos de final') || [],
    sf: allMatches?.filter(m => m.group === 'Semifinales') || [],
    final: allMatches?.find(m => m.group === 'Final')
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-auto">
      <div className="max-w-[2000px] mx-auto p-12 min-w-[1500px]">
        
        {/* Cabecera */}
        <header className="text-center mb-20 space-y-4">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter">
            <span className="text-blue-500">Fase Final</span>
          </h1>
          <div className="flex justify-center gap-10 mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            <span>Deciseisavos</span> • <span>Octavos</span> • <span>Cuartos</span> • <span>Semis</span> • <span className="text-blue-400">Final</span>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Road to MetLife Stadium</p>
        </header>

        <div className="grid grid-cols-9 gap-4 items-center">
          {/* Hemisferio Izquierdo */}
          <div className="space-y-4">
            {rounds.r32.slice(0, 8).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-12">
            {rounds.r16.slice(0, 4).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-24">
            {rounds.qf.slice(0, 2).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-48">
            {rounds.sf.slice(0, 1).map(m => <MatchNode key={m.id} match={m} />)}
          </div>

          {/* CENTRO: LA FINAL */}
          <div className="flex flex-col items-center py-20">
            <div className="relative mb-10">
               <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20"></div>
               <img src="/copa-mundo.png" className="w-40 h-40 object-contain relative z-10" alt="Trofeo" />
            </div>
            {rounds.final && <FinalNode match={rounds.final} />}
          </div>

          {/* Hemisferio Derecho (Espejo) */}
          <div className="space-y-48">
            {rounds.sf.slice(1, 2).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-24">
            {rounds.qf.slice(2, 4).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-12">
            {rounds.r16.slice(4, 8).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
          <div className="space-y-4">
            {rounds.r32.slice(8, 16).map(m => <MatchNode key={m.id} match={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchNode({ match }: { match: any }) {
  return (
    <div className="w-44 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all group shadow-lg">
      <div className="p-3 space-y-2">
        <TeamRow team={match.home_team} score={match.home_score} />
        <div className="h-px bg-slate-800"></div>
        <TeamRow team={match.away_team} score={match.away_score} />
      </div>
      <div className="bg-slate-800/50 px-3 py-1 text-[8px] font-bold text-slate-500 flex justify-between uppercase">
        <span>W{match.id}</span>
        <span>{new Date(match.scheduled_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function TeamRow({ team, score }: { team: any, score: number }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2 truncate">
        <TeamImage src={team.image} name={team.name} className="w-5 h-5" />
        <span className="text-[10px] font-bold truncate text-slate-300">{team.name}</span>
      </div>
      <span className="text-xs font-black text-blue-400">{score ?? '-'}</span>
    </div>
  );
}

function FinalNode({ match }: { match: any }) {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-900 p-[2px] rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)]">
      <div className="bg-slate-950 rounded-[14px] p-5">
        <div className="text-center mb-4">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Gran Final</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <TeamImage src={match.home_team.image} name={match.home_team.name} className="w-8 h-8" />
               <span className="text-sm font-black">{match.home_team.name}</span>
            </div>
            <span className="text-xl font-black text-white">{match.home_score ?? '0'}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <TeamImage src={match.away_team.image} name={match.away_team.name} className="w-8 h-8" />
               <span className="text-sm font-black">{match.away_team.name}</span>
            </div>
            <span className="text-xl font-black text-white">{match.away_score ?? '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}