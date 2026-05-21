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
          complete: (results) => {
            // Check if HTML is returned (authentication issue)
            if (text.trim().startsWith('<!DOCTYPE html>')) {
               setError("No se puede acceder a los datos. Asegúrate de que el Google Sheet sea público ('Cualquiera con el enlace' puede ver).");
               setLoading(false);
               return;
            }

            const parsedData: ScorecardData[] = results.data.map((row: any) => ({
              timestamp: row['Timestamp'] || row['Marca temporal'] || row['Fecha'] || new Date().toISOString(),
              registros_persea: parseFloat(row['Nuevos registros en Persea'] || '0'),
              footfall_fisico: parseFloat(row['Footfall físico - CDC'] || '0'),
              m1_completion: parseFloat(row['M1 Completion (%)'] || '0'),
              redenciones_fisicas: parseFloat(row['Redenciones físicas'] || '0'),
              pipeline_nanos: parseFloat(row['Pipeline de nanos'] || '0'),
              ugc_valido: parseFloat(row['UGC Válido (%)'] || '0'),
              perfiles_activos: parseFloat(row['Perfiles activos'] || '0'),
              incremento_ticket: parseFloat(row['Incremento de ticket promedio (%)'] || '0'),
              cpa: parseFloat(row['Costo por adquisición (CPA)'] || '0'),
              vino_tinto: parseFloat(row['Vino tinto (%)'] || '0'),
              vino_blanco: parseFloat(row['Vino blanco (%)'] || '0'),
              espumoso: parseFloat(row['Espumoso (%)'] || '0'),
              reservas: parseFloat(row['Reservas (%)'] || '0'),
              otros: parseFloat(row['Otros (%)'] || '0'),
            }));
            
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
