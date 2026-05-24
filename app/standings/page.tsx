import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function StandingsPage() {
  const { data: standings, error } = await supabase
    .from('groups')
    .select('*')
    .order('group_name', { ascending: true })
    .order('points', { ascending: false })
    .order('goals_for', { ascending: false });

  if (error) return <div className="p-10 text-center text-red-500">Error al cargar las clasificaciones.</div>;

  // Agrupar equipos por grupo
  const groups = standings.reduce((acc: any, team: any) => {
    if (!acc[team.group_name]) acc[team.group_name] = [];
    acc[team.group_name].push(team);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Cabecera de Página Coherente */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-[2rem] p-10 text-white mb-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Clasificación de Grupos
          </h1>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.keys(groups).map((groupName) => (
          <div key={groupName} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="font-black uppercase tracking-widest text-blue-600">{groupName}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase text-gray-400 font-black">
                  <tr>
                    <th className="px-6 py-3">Equipo</th>
                    <th className="px-2 py-3 text-center">PJ</th>
                    <th className="px-2 py-3 text-center">DG</th>
                    <th className="px-6 py-3 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groups[groupName].map((team: any, index: number) => (
                    <tr key={team.id} className={index < 2 ? "bg-blue-50/30" : ""}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <span className={`text-[10px] font-bold ${index < 2 ? "text-blue-600" : "text-gray-300"}`}>
                          {index + 1}
                        </span>
                        <img src={team.team_image} className="w-6 h-4 object-cover rounded-sm shadow-sm" alt="" />
                        <span className="font-bold text-gray-800">{team.team_name}</span>
                      </td>
                      <td className="px-2 py-4 text-center font-medium text-gray-500">{team.played}</td>
                      <td className="px-2 py-4 text-center font-medium text-gray-500">
                        {team.goals_for - team.goals_against}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block w-8 py-1 bg-white border border-gray-200 rounded-lg font-black text-blue-600 shadow-sm">
                          {team.points}
                        </span>
                      </td>
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