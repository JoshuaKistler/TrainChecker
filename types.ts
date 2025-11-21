// Transport API Types
export interface Station {
  id: string;
  name: string;
  score?: number;
  coordinate: {
    type: string;
    x: number;
    y: number;
  };
  distance?: number;
}

export interface Stop {
  station: Station;
  arrival: string | null;
  arrivalTimestamp: number | null;
  departure: string | null;
  departureTimestamp: number | null;
  platform: string;
  delay: number;
}

export interface TrainCategory {
  name: string; // e.g., "S2", "IR35"
  category: string; // e.g., "S", "IR"
  number: string; // e.g., "18235"
  operator: string; // e.g., "SBB"
  to: string; // Destination
}

export interface StationBoardEntry {
  name: string; // Train name (e.g. "S2")
  category: string;
  categoryCode: string;
  number: string;
  operator: string;
  to: string;
  stop: Stop;
  passList: Stop[];
}

// UI Types
export interface TimeSelection {
  time: string; // "HH:mm" format
  durationMinutes: number;
}

// Gemini Service Types
export interface StationInsight {
  summary: string;
  pointsOfInterest: string[];
  travelTips: string;
}