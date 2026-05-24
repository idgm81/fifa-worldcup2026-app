'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { MatchGame } from '@/types/match';
import { IoFootball, IoAlertCircle, IoTimeOutline, IoVolumeHighOutline, IoVolumeMuteOutline, IoPeopleOutline } from "react-icons/io5";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LiveMatchDetailsPage({ matchId }: { matchId: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const prevScore = useRef({ home: 0, away: 0 });
  
  // SWR llamará a nuestra API interna que sincroniza con Football API cada minuto
  const { data: match, error } = useSWR<MatchGame>(`/api/matches/${matchId}/sync`, fetcher, {
    refreshInterval: 60000, // 1 minuto
    revalidateOnFocus: true
  });

  useEffect(() => {
    if (match?.game?.score) {
      const { home, away } = match.game.score;
      if ((home > prevScore.current.home || away > prevScore.current.away) && !isMuted) {
        new Audio('/sounds/goal.mp3').play().catch(() => {});
      }
      prevScore.current = { home, away };
    }
  }, [match, isMuted]);

  if (error) return <div className="p-10 text-center text-red-500">Error de conexión con el estadio.</div>;
  if (!match) return <div className="p-10 text-center animate-pulse text-blue-600 font-bold">CONECTANDO CON LA SEÑAL EN VIVO...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      
      {/* Marcador Principal */}
      <div className="relative bg-gradient-to-br from-blue-900 to-black text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/patterns/stadium.svg')] bg-cover"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="text-center flex-1">
            <img src={match.game.home_team.image} className="w-24 h-24 mx-auto drop-shadow-lg" alt="Local" />
            <h2 className="text-2xl font-black mt-4 uppercase tracking-tighter">{match.game.home_team.name}</h2>
          </div>
          
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-4 py-1 rounded-full mb-4">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
               <span className="text-xs font-black text-red-500 uppercase tracking-widest">{match.game.status === 'live' ? `EN VIVO ${match.game.minute}'` : 'FINALIZADO'}</span>
            </div>
            <div className="text-8xl font-black tabular-nums tracking-tighter">{match.game.score.home} - {match.game.score.away}</div>
            <button onClick={() => setIsMuted(!isMuted)} className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 mx-auto">
              {isMuted ? <IoVolumeMuteOutline size={16}/> : <IoVolumeHighOutline size={16}/>} {isMuted ? 'Sonido Desactivado' : 'Sonido de Estadio'}
            </button>
          </div>

          <div className="text-center flex-1">
            <img src={match.game.away_team.image} className="w-24 h-24 mx-auto drop-shadow-lg" alt="Visitante" />
            <h2 className="text-2xl font-black mt-4 uppercase tracking-tighter">{match.game.away_team.name}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Eventos */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
          <h3 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2 text-gray-400">
            <IoTimeOutline className="text-blue-600"/> Cronología
          </h3>
          <div className="space-y-8 border-l-2 border-gray-50 ml-4 pl-6">
            {match.game.events.map((ev, i) => (
              <div key={i} className="relative">
                 <div className="absolute -left-[37px] top-0 bg-white rounded-full p-1.5 shadow-sm border border-gray-100 z-10">
                    {ev.event.type === 'goal' && <IoFootball className="text-green-600 animate-bounce" />}
                    {ev.event.type === 'card' && <div className={`w-3 h-4 ${ev.event.detail.includes('Yellow') ? 'bg-yellow-400' : 'bg-red-600'} rounded-sm`} />}
                    {ev.event.type === 'var' && <IoAlertCircle className="text-purple-600" />}
                 </div>
                 <div className="text-[10px] font-black text-blue-600 mb-1">{ev.event.minute}'</div>
                 <div className="text-sm font-bold leading-tight">{ev.event.player}</div>
                 <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">{ev.event.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Stats y Alineaciones */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Estadísticas de Barras */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-sm uppercase tracking-widest mb-10 text-gray-400 text-center">Rendimiento en el campo</h3>
            <div className="space-y-10">
              <StatBar label="Posesión" home={match.game.stats.possession.home} away={match.game.stats.possession.away} suffix="%" />
              <StatBar label="Remates Totales" home={match.game.stats.shots.home} away={match.game.stats.shots.away} />
              <StatBar label="Córners" home={match.game.stats.corners.home} away={match.game.stats.corners.away} />
              <StatBar label="Faltas" home={match.game.stats.fouls?.home || 0} away={match.game.stats.fouls?.away || 0} />
            </div>
          </div>

          {/* Alineaciones */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center justify-center gap-2 text-gray-400">
              <IoPeopleOutline size={20}/> Alineaciones Iniciales
            </h3>
            <div className="grid grid-cols-2 gap-12">
              <LineupList teamName={match.game.home_team.name} players={match.game.lineups?.home.startXI || []} side="left" />
              <LineupList teamName={match.game.away_team.name} players={match.game.lineups?.away.startXI || []} side="right" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatBar({ label, home, away, suffix = "" }: any) {
  const total = home + away;
  const homePerc = total === 0 ? 50 : (home / total) * 100;
  
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-3">
        <span className="text-2xl font-black tracking-tighter">{home}{suffix}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-blue-600 transition-colors">{label}</span>
        <span className="text-2xl font-black tracking-tighter">{away}{suffix}</span>
      </div>
      <div className="h-3 bg-gray-50 rounded-full overflow-hidden flex p-0.5 border border-gray-100">
        <div className="bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${homePerc}%` }} />
        <div className="bg-red-500 rounded-full transition-all duration-1000 ease-out ml-auto" style={{ width: `${100 - homePerc}%` }} />
      </div>
    </div>
  );
}

function LineupList({ teamName, players, side }: any) {
  return (
    <div className={side === 'right' ? 'text-right' : 'text-left'}>
      <p className="text-[10px] font-black text-gray-300 uppercase mb-4 tracking-widest">{teamName}</p>
      <ul className="space-y-3">
        {players.map((p: any, i: number) => (
          <li key={i} className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
              {p.number}
            </span>
            <span className="text-sm font-bold text-gray-700">{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}