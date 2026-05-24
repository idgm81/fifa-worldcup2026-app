import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function StandingsPage() {
  // Obtenemos los equipos ordenados por puntos y diferencia de goles
  const { data: teams } = await supabase
    .from('groups')
    .select('*')
    .order('group_name', { ascending: true })
    .order('points', { ascending: false })
    .order('goals_for', { ascending: false });

  // Agrupamos por nombre de grupo (Grupo A, Grupo B...)
  const groups = teams?.reduce((acc: any, team: any) => {
    if (!acc[team.group_name]) acc[team.group_name] = [];
    acc[team.group_name].push(team);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 animate-in fade-in duration-700">
      
      {/* Cabecera estilo Home (Azul) */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('/patterns/stadium.svg')] bg-cover"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Clasificación</h1>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {groups && Object.keys(groups).map((groupName) => (
          <div key={groupName} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-black uppercase tracking-tight text-blue-900">{groupName}</h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fase de Grupos</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                    <th className="px-8 py-4 font-bold">Pos / Equipo</th>
                    <th className="px-3 py-4 text-center">PJ</th>
                    <th className="px-3 py-4 text-center">G</th>
                    <th className="px-3 py-4 text-center">E</th>
                    <th className="px-3 py-4 text-center">P</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">GF</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">GC</th>
                    <th className="px-3 py-4 text-center font-bold text-gray-800">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groups[groupName].map((team: any, index: number) => (
                    <tr key={team.id} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-8 py-4 flex items-center gap-3">
                        <span className={`text-xs font-black w-4 shadow-sm rounded-sm flex items-center justify-center h-5 
                          ${index < 2 
                            ? 'bg-green-100 text-green-700' // 1º y 2º: Directos
                            : index === 2 
                              ? 'bg-blue-100 text-blue-700'  // 3º: Pendiente de otros grupos
                              : 'bg-gray-100 text-gray-400'  // 4º: Eliminado
                          }`}>
                          {index + 1}
                        </span>
                        <img src={team.team_image} alt="" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {team.team_name}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-500">{team.played}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-600">{team.won}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-600">{team.drawn}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-600">{team.lost}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-400 hidden md:table-cell">{team.goals_for}</td>
                      <td className="px-3 py-4 text-center text-sm font-medium text-gray-400 hidden md:table-cell">{team.goals_against}</td>
                      <td className="px-3 py-4 text-center text-sm font-black text-blue-600">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}