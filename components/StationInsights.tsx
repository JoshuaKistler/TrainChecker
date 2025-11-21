import React, { useEffect, useState } from 'react';
import { getStationInsights } from '../services/geminiService.ts';
import { StationInsight } from '../types.ts';
import { SparklesIcon } from './Icons.tsx';

interface StationInsightsProps {
  stationName: string;
}

const StationInsights: React.FC<StationInsightsProps> = ({ stationName }) => {
  const [data, setData] = useState<StationInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setData(null);
    setVisible(false);
  }, [stationName]);

  const handleGenerate = async () => {
    setLoading(true);
    setVisible(true);
    const insights = await getStationInsights(stationName);
    setData(insights);
    setLoading(false);
  };

  if (!stationName) return null;

  return (
    <div className="mt-6 mb-4">
      {!visible ? (
        <button
          onClick={handleGenerate}
          className="flex items-center space-x-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors border border-purple-200 mx-auto sm:mx-0"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Ask AI for traveler insights about {stationName}</span>
        </button>
      ) : (
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-20"></div>
            
            <div className="flex items-center space-x-2 mb-3 text-purple-800">
                <SparklesIcon className="h-5 w-5" />
                <h3 className="font-bold">Gemini Insights: {stationName}</h3>
            </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-purple-100 rounded w-3/4"></div>
              <div className="h-4 bg-purple-100 rounded w-full"></div>
              <div className="h-4 bg-purple-100 rounded w-1/2"></div>
            </div>
          ) : data ? (
            <div className="text-sm text-gray-700 space-y-4 relative z-10">
              <div>
                <p className="font-medium text-purple-900 mb-1">Summary</p>
                <p className="leading-relaxed">{data.summary}</p>
              </div>
              
              <div>
                <p className="font-medium text-purple-900 mb-1">Nearby Points of Interest</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {data.pointsOfInterest.map((poi, i) => (
                    <li key={i}>{poi}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-100/50 p-3 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-800 block mb-1">💡 Travel Tip</span>
                {data.travelTips}
              </div>
            </div>
          ) : (
            <p className="text-red-500 text-sm">Failed to load insights. Please try again later.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StationInsights;