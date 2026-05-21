import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export interface ScorecardData {
  timestamp: string;
  registros_persea: number;
  footfall_fisico: number;
  m1_completion: number;
  redenciones_fisicas: number;
  pipeline_nanos: number;
  ugc_valido: number;
  perfiles_activos: number;
  incremento_ticket: number;
  cpa: number;
  vino_tinto: number;
  vino_blanco: number;
  espumoso: number;
  reservas: number;
  otros: number;
}

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1Ov7AwtaQZD4EHiANmS7sj6Hiq5zcxbmKOUNmzcFGQuI/gviz/tq?tqx=out:csv";

export function useGoogleSheetData() {
  const [data, setData] = useState<ScorecardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            // Check if HTML is returned (authentication issue)
            if (text.trim().startsWith('<!DOCTYPE html>')) {
               setError("No se puede acceder a los datos. Asegúrate de que el Google Sheet sea público ('Cualquiera con el enlace' puede ver).");
               setLoading(false);
               return;
            }

            // Agrupar los datos por Fecha
            const dataByDate: Record<string, Partial<ScorecardData>> = {};

            results.data.forEach((row: any) => {
              const date = row['Fecha'] || new Date().toLocaleDateString();
              
              if (!dataByDate[date]) {
                dataByDate[date] = { 
                  timestamp: date,
                  registros_persea: 0,
                  footfall_fisico: 0,
                  m1_completion: 0,
                  redenciones_fisicas: 0,
                  pipeline_nanos: 0,
                  ugc_valido: 0,
                  perfiles_activos: 0,
                  incremento_ticket: 0,
                  cpa: 0,
                  vino_tinto: 0,
                  vino_blanco: 0,
                  espumoso: 0,
                  reservas: 0,
                  otros: 0
                };
              }

              const metric = row['ScoreCard'];
              const value = parseFloat(row['Valor'] || '0');

              if (metric === 'Nuevos registros en Persea') dataByDate[date].registros_persea = value;
              else if (metric === 'Footfall físico') dataByDate[date].footfall_fisico = value;
              else if (metric === 'MI Completion') dataByDate[date].m1_completion = value;
              else if (metric === 'Redenciones Físicas') dataByDate[date].redenciones_fisicas = value;
              else if (metric === 'Pipeline de Nanos') dataByDate[date].pipeline_nanos = value;
              else if (metric === 'UGC válido') dataByDate[date].ugc_valido = value;
              else if (metric === 'Perfiles activos') dataByDate[date].perfiles_activos = value;
              else if (metric === 'Incremento ticket') dataByDate[date].incremento_ticket = value;
              else if (metric === 'CPA') dataByDate[date].cpa = value;
              else if (metric === 'Vino tinto') dataByDate[date].vino_tinto = value;
              else if (metric === 'Vino blanco') dataByDate[date].vino_blanco = value;
              else if (metric === 'Espumoso') dataByDate[date].espumoso = value;
              else if (metric === 'Reservas') dataByDate[date].reservas = value;
              else if (metric === 'Otros') dataByDate[date].otros = value;
            });

            // Convertir el objeto a array y ordenar por fecha
            const parsedData = Object.values(dataByDate).sort((a, b) => {
              const parseDate = (d: string) => {
                const parts = d.split('/');
                // Asume formato DD/MM/YYYY
                if(parts.length === 3) {
                  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
                }
                return new Date(d).getTime();
              };
              return parseDate(a.timestamp as string) - parseDate(b.timestamp as string);
            }) as ScorecardData[];
            
            setData(parsedData);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
