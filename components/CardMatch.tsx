// components/CardMatch.tsx

import { MatchGame } from "@/types/match";
import FechaLocal from "@/components/FechaLocal";
import TeamImage from "@/components/TeamImage";
import Link from "next/link";

export default function CardMatch({ game }: MatchGame) {
  // Extraemos datos del objeto partido (basado en tu script)
  const { group, scheduled_at, location, home_team, away_team, broadcasters } = game;

  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group">
      {game.status === 'live' && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl animate-pulse">
          EN VIVO
        </div>
      )}

      {/* Cabecera del Partido */}
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {group}
        </span>
        <span className="text-xs text-gray-500 font-medium">
          <FechaLocal date={scheduled_at} showDate={true} showTime={false} />
        </span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center gap-4">
          {/* Equipo Local */}
          <div className="flex flex-col items-center flex-1">
            <TeamImage src={game.home_team.image} name={game.home_team.name} className="w-16 h-16" />
            <span className="text-sm font-bold text-center h-10 flex items-center">
              {home_team.name}
            </span>
          </div>

          {/* VS / Hora */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-gray-300 italic">VS</span>
            <div className="mt-2 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-bold">
              <FechaLocal date={scheduled_at} showDate={false} showTime={true} />
            </div>
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center flex-1">
            <TeamImage src={game.away_team.image} name={game.away_team.name} className="w-16 h-16" />
            <span className="text-sm font-bold text-center h-10 flex items-center">
              {away_team.name}
            </span>
          </div>
        </div>

        {/* Estadio y Ciudad */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location.name}, {location.city}
          </div>
          
          {/* Sección de Canales (Extraído del description o campo personalizado) */}
          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
             <span className="text-[10px] font-bold text-gray-400 uppercase">Dónde verlo:</span>
             <div className="flex gap-2">
              {broadcasters.map((id, index) => (
                <div key={index} className="bg-gray-50 p-1 rounded border border-gray-100 flex items-center justify-center">
                  <img 
                    src={`https://extranets.fifa.com/TvStationPhotos/${id}.png`}
                    alt="Canal TV" 
                    className="h-5 w-auto object-contain grayscale hover:grayscale-0 transition-all" 
                  />
                </div>
              ))}
             </div>
          </div>
        </div>
      </div>
      
      <Link 
        href={`/matches/${game.id}`}
        title={`Seguir en directo el partido ${game.home_team.name} vs ${game.away_team.name}`}
        className="block w-full py-3 bg-gray-900 text-white font-bold text-sm hover:bg-blue-700 transition-colors text-center">
        SEGUIR EN DIRECTO
      </Link>
    </div>
  );
}