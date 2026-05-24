'use client';

import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { MatchGame } from '@/types/match';
import { IoFootball, IoAlertCircle, IoTimeOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LiveMatchDetails({ matchId }: { matchId: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const prevScore = useRef({ home: 0, away: 0 });
  
  const { data: match, error } = useSWR<MatchGame>(`/matches/${matchId}`, fetcher, {
    refreshInterval: 60000,
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


  if (error) return <div className="p-10 text-center text-red-500">Error de conexión.</div>;
  if (!match) return <div className="p-10 text-center animate-pulse">Sincronizando con el estadio...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Marcador y Sonido */}
      <div className="flex justify-between items-end bg-blue-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="text-center flex-1">
          <img src={match.game.home_team.image} className="w-20 h-20 mx-auto" alt={match.game.home_team.name} />
          <h2 className="text-xl font-bold mt-2">{match.game.home_team.name}</h2>
        </div>
        
        <div className="flex-1 text-center">
          <div className="text-sm font-bold text-blue-300 animate-pulse flex items-center justify-center gap-1">
             <span className="w-2 h-2 bg-red-500 rounded-full"></span> EN VIVO {match.game.minute}'
          </div>
          <div className="text-7xl font-black my-2">{match.game.score.home} - {match.game.score.away}</div>
          <button onClick={() => setIsMuted(!isMuted)} className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100 flex items-center justify-center gap-2 mx-auto">
            {isMuted ? <IoVolumeMuteOutline /> : <IoVolumeHighOutline />} {isMuted ? 'Silenciado' : 'Sonido Activo'}
          </button>
        </div>

        <div className="text-center flex-1">
          <img src={match.game.away_team.image} className="w-20 h-20 mx-auto" alt={match.game.away_team.name} />
          <h2 className="text-xl font-bold mt-2">{match.game.away_team.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><IoTimeOutline/> Eventos</h3>
          <div className="space-y-6 border-l-2 border-gray-100 ml-4 pl-6">
            {match.game.events.map(({ event }, i) => (
              <div key={i} className={`relative p-3 rounded-xl ${event.type === 'var' ? 'bg-red-50 border-red-200 border animate-shake' : 'bg-gray-50'}`}>
                 <div className="absolute -left-[35px] top-4 bg-white rounded-full p-1 shadow-sm border border-gray-200">
                    {event.type === 'goal' && <IoFootball className="text-green-600" />}
                    {event.type === 'card' && <div className="w-3 h-4 bg-yellow-400 rounded-sm" />}
                    {event.type === 'var' && <IoAlertCircle className="text-red-500" />}
                 </div>
                 <div className="text-xs font-bold text-gray-400">{event.minute}'</div>
                 <div className="font-bold">{event.player}</div>
                 {event.detail && <div className="text-[10px] text-red-600 font-bold uppercase">{event.detail}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-8">Estadísticas Superiores</h3>
          <StatProgress label="Posesión" home={match.game.stats.possession.home} away={match.game.stats.possession.away} suffix="%" />
          <div className="grid grid-cols-2 gap-4 mt-8">
            <StatBox label="Remates" home={match.game.stats.shots.home} away={match.game.stats.shots.away} />
            <StatBox label="Corners" home={match.game.stats.corners.home} away={match.game.stats.corners.away} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatProgress({ label, home, away, suffix = "" }: any) {
  const perc = (home / (home + away)) * 100;
  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm font-black mb-2">
        <span>{home}{suffix}</span>
        <span className="text-gray-400 uppercase text-[10px] tracking-widest">{label}</span>
        <span>{away}{suffix}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="bg-blue-600 transition-all duration-1000" style={{ width: `${perc}%` }} />
        <div className="bg-red-500 transition-all duration-1000" style={{ width: `${100 - perc}%` }} />
      </div>
    </div>
  );
}

function StatBox({ label, home, away }: any) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">{label}</div>
      <div className="text-2xl font-black flex justify-center gap-4">
        <span className="text-blue-600">{home}</span>
        <span className="text-gray-200">|</span>
        <span className="text-red-500">{away}</span>
      </div>
    </div>
  );
}