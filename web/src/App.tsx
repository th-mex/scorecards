import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useGoogleSheetData } from './useData';
import { Activity, Users, Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { data, loading, error } = useGoogleSheetData();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2 text-center text-red-400">Error al cargar datos</h2>
        <p className="text-gray-400 text-center max-w-md">{error || "No hay datos disponibles"}</p>
        <p className="mt-4 text-sm text-gray-500 text-center max-w-md border border-gray-700 p-4 rounded-lg bg-neutral-800">
          <strong>Nota importante:</strong> El Google Sheet debe estar configurado como <strong>"Cualquier persona con el enlace puede ver"</strong> para que los datos puedan ser leídos por la aplicación.
        </p>
      </div>
    );
  }

  const latestData = data[data.length - 1];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const prefData = [
    { name: 'Vino tinto', value: latestData.vino_tinto },
    { name: 'Vino blanco', value: latestData.vino_blanco },
    { name: 'Espumoso', value: latestData.espumoso },
    { name: 'Reservas', value: latestData.reservas },
    { name: 'Otros', value: latestData.otros },
  ];

  const parseDateStr = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    return new Date(dateStr);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      
      {/* Background Logo */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none opacity-80 md:opacity-100">
        <img src="/logo-torres.png" alt="Torres Brandy" className="h-[100vh] object-contain" />
      </div>

      <div className="relative z-10 p-6 md:p-12">
        <header className="mb-12 border-b border-neutral-800/50 pb-6 flex flex-col items-center text-center gap-4 pt-4 md:pt-8">
          <h2 className="text-brand-gold font-normal uppercase tracking-widest text-sm mb-2 drop-shadow-md">Reporte Semanal</h2>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4 drop-shadow-lg">La Ruta del Legado</h1>
          <p className="text-neutral-300 max-w-2xl text-lg bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/5">
            Reporte ejecutivo de métricas de campaña. Actualización semanal de los cuatro pilares estratégicos: 
            tráfico, gamificación, nano influencers e inteligencia de datos.
          </p>
          <div className="mt-2 bg-black/40 p-3 rounded-lg backdrop-blur-sm border border-white/5">
            <p className="text-sm text-neutral-400">Última actualización</p>
            <p className="font-mono text-brand-gold">{parseDateStr(latestData.timestamp).toLocaleDateString()}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div {...fadeUp} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={64} />
          </div>
          <h3 className="text-brand-gold font-normal text-sm uppercase mb-6 tracking-wider">Tráfico</h3>
          
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{latestData.registros_persea}</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Nuevos registros en Persea</p>
            <p className="text-xs text-neutral-500 mt-1">Usuarios incorporados al ecosistema digital</p>
          </div>
          
          <div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{latestData.footfall_fisico}</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Footfall físico — CDC</p>
            <p className="text-xs text-neutral-500 mt-1">Visitas en el Centro de Distribución Comercial</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={64} />
          </div>
          <h3 className="text-brand-gold font-normal text-sm uppercase mb-6 tracking-wider">Gamificación</h3>
          
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{latestData.m1_completion}%</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">M1 Completion</p>
            <p className="text-xs text-neutral-500 mt-1">Meta: {">"}70% completan primer módulo</p>
          </div>
          
          <div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{latestData.redenciones_fisicas}</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Redenciones físicas</p>
            <p className="text-xs text-neutral-500 mt-1">Recompensas canjeadas en puntos físicos</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={64} />
          </div>
          <h3 className="text-brand-gold font-normal text-sm uppercase mb-6 tracking-wider">Nano Influencers</h3>
          
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{latestData.pipeline_nanos}</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Pipeline de nanos</p>
            <p className="text-xs text-neutral-500 mt-1">Meta: 30 creadores activos en campaña</p>
          </div>
          
          <div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{latestData.ugc_valido}%</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">UGC Válido</p>
            <p className="text-xs text-neutral-500 mt-1">Contenido generado con criterios de calidad</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-gold/50 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} />
          </div>
          <h3 className="text-brand-gold font-normal text-sm uppercase mb-6 tracking-wider">Eficiencia</h3>
          
          <div className="mb-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-green-400">+{latestData.incremento_ticket}%</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Incremento ticket promedio</p>
            <p className="text-xs text-neutral-500 mt-1">Crecimiento en valor promedio de compra</p>
          </div>
          
          <div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">${latestData.cpa}</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Costo por adquisición (CPA)</p>
            <p className="text-xs text-neutral-500 mt-1">Inversión media para nuevo cliente activo</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl">
          <div className="mb-6">
            <h3 className="text-brand-gold font-normal text-sm uppercase mb-2 tracking-wider">Inteligencia</h3>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold">{latestData.perfiles_activos}</span>
              <span className="text-xl text-neutral-400 pb-1">/ 2,000</span>
            </div>
            <p className="text-sm font-normal text-white mt-1">Perfiles activos</p>
            <p className="text-xs text-neutral-400">En ecosistema de datos Torres 10</p>
            
            <div className="w-full bg-neutral-800/50 rounded-full h-2.5 mt-4">
              <div className="bg-brand-gold h-2.5 rounded-full shadow-[0_0_10px_rgba(198,156,109,0.5)]" style={{ width: `${Math.min(100, (latestData.perfiles_activos / 2000) * 100)}%` }}></div>
            </div>
          </div>

          <h4 className="text-sm font-normal text-white mb-4 mt-8">Zero-party data — Preferencias de consumo</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prefData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" horizontal={false} />
                <XAxis type="number" tick={{fill: '#9ca3af'}} stroke="#ffffff1a" />
                <YAxis dataKey="name" type="category" tick={{fill: '#e5e7eb'}} stroke="#ffffff1a" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000cc', borderColor: '#ffffff1a', backdropFilter: 'blur(4px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#c69c6d" radius={[0, 4, 4, 0]} name="%" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="bg-black/60 backdrop-blur-md border border-neutral-800/50 p-6 rounded-2xl">
           <h3 className="text-brand-gold font-normal text-sm uppercase mb-6 tracking-wider">Evolución de Campaña (Tracking)</h3>
           <p className="text-xs text-neutral-400 mb-6">Progreso de registros y redenciones a lo largo del tiempo</p>
           
           <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  stroke="#ffffff1a" 
                  tickFormatter={(val) => {
                    const d = parseDateStr(val);
                    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`;
                  }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{fill: '#9ca3af'}} stroke="#ffffff1a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000cc', borderColor: '#ffffff1a', color: '#fff', backdropFilter: 'blur(4px)' }}
                  labelFormatter={(label) => parseDateStr(label).toLocaleDateString()}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                <Line type="monotone" dataKey="registros_persea" name="Registros" stroke="#c69c6d" strokeWidth={3} dot={{r: 4, fill: '#c69c6d'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="redenciones_fisicas" name="Redenciones" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
                <Line type="monotone" dataKey="footfall_fisico" name="Visitas Físicas" stroke="#3b82f6" strokeWidth={2} dot={{r: 3, fill: '#3b82f6'}} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </motion.div>
      </div>
      
      </div>
    </div>
  );
}

export default App;
