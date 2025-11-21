import { Station, StationBoardEntry } from '../types';

const API_BASE = 'https://transport.opendata.ch/v1';

export const searchStations = async (query: string): Promise<Station[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${API_BASE}/locations?query=${encodeURIComponent(query)}&type=station`);
    if (!response.ok) throw new Error('Failed to fetch stations');
    
    const data = await response.json();
    return data.stations || [];
  } catch (error) {
    console.error('Station search error:', error);
    return [];
  }
};

export const getStationBoard = async (
  stationName: string, 
  datetimeISO: string, // ISO string of the desired start time
  limit: number = 40
): Promise<StationBoardEntry[]> => {
  try {
    // transport.opendata.ch expects datetime in YYYY-MM-DD HH:mm format or similar, or we can pass nothing for "now".
    // We'll construct the URL specifically.
    const params = new URLSearchParams();
    params.append('station', stationName);
    params.append('limit', limit.toString());
    if (datetimeISO) {
        params.append('datetime', datetimeISO); 
    }
    
    const response = await fetch(`${API_BASE}/stationboard?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch station board');
    
    const data = await response.json();
    return data.stationboard || [];
  } catch (error) {
    console.error('Station board fetch error:', error);
    return [];
  }
};