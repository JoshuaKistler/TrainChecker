import React, { useState, useEffect } from 'react';
import StationSearch from './components/StationSearch';
import TrainList from './components/TrainList';
import TrainDetailModal from './components/TrainDetailModal';
import StationInsights from './components/StationInsights';
import StatsChart from './components/StatsChart';
import { Station, StationBoardEntry } from './types';
import { getStationBoard } from './services/transportService';
import { ClockIcon, TrainIcon } from './components/Icons';

const App: React.FC = () => {
  // -- State --
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Time State
  const [timeStr, setTimeStr] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const [duration, setDuration] = useState<number>(60); // Default 60 min range

  // Data State
  const [trains, setTrains] = useState<StationBoardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<StationBoardEntry | null>(null);

  // -- Effects --
  useEffect(() => {
    if (selectedStation) {
      fetchBoard();
    } else {
      setTrains([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation, timeStr, duration]);

  // -- Handlers --
  const fetchBoard = async () => {
    if (!selectedStation) return;
    setLoading(true);
    
    // Construct ISO string for API from selected time
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const queryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    // API limit logic: crude estimation, 2 trains per min approx max? 
    // We fetch a batch and filter client side for the duration range if needed
    const limit = Math.max(20, duration * 2); 
    
    const results = await getStationBoard(selectedStation.name, queryDate.toISOString(), limit);
    
    // Filter by duration strictly
    const endTime = queryDate.getTime() + (duration * 60 * 1000);
    const filtered = results.filter(t => {
      if (!t.stop.departure) return false;
      const depTime = new Date(t.stop.departure).getTime();
      return depTime >= queryDate.getTime() && depTime <= endTime;
    });

    setTrains(filtered);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] font-sans text-gray-900">
      
      {/* Header */}
      <header className="bg-swiss-red text-white shadow-md z-20 sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
                <TrainIcon className="h-6 w-6 text-white" />
            </div>
            <div className="font-bold text-2xl tracking-tight flex items-center">
              <span>TrainChecker</span>
            </div>
          </div>
          <div className="text-xs font-medium bg-black/20 px-2 py-1 rounded">
            v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                 Plan Your View
              </h2>
              
              {/* Station Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
                <StationSearch onSelect={setSelectedStation} />
                {selectedStation && (
                   <div className="mt-2 text-sm text-green-700 bg-green-50 px-2 py-1 rounded inline-block border border-green-100">
                      Selected: <strong>{selectedStation.name}</strong>
                   </div>
                )}
              </div>

              {/* Time Controls */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                     <ClockIcon className="w-4 h-4 mr-1" /> Time
                   </label>
                   <input 
                    type="time" 
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-swiss-red focus:border-swiss-red sm:text-sm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Range (min)</label>
                   <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-swiss-red focus:border-swiss-red sm:text-sm bg-white"
                   >
                     <option value={15}>15 min</option>
                     <option value={30}>30 min</option>
                     <option value={60}>1 hour</option>
                     <option value={120}>2 hours</option>
                   </select>
                </div>
              </div>

              {/* Station Insights (AI) */}
              {selectedStation && (
                <>
                  <div className="border-t border-gray-100 my-4"></div>
                  <StationInsights stationName={selectedStation.name} />
                </>
              )}

              {/* Stats Chart */}
               {trains.length > 0 && (
                 <StatsChart trains={trains} startHour={parseInt(timeStr.split(':')[0])} />
               )}

            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-4">
               <h2 className="text-xl font-bold text-gray-900">
                 {selectedStation ? `Departures from ${selectedStation.name}` : 'Select a station to begin'}
               </h2>
               {trains.length > 0 && (
                 <span className="text-sm text-gray-500 font-medium">{trains.length} trains found</span>
               )}
            </div>
            
            <TrainList 
              trains={trains} 
              loading={loading} 
              onSelectTrain={setSelectedTrain} 
            />
          </div>

        </div>
      </main>

      {/* Modals */}
      {selectedTrain && (
        <TrainDetailModal 
          train={selectedTrain} 
          onClose={() => setSelectedTrain(null)} 
        />
      )}

    </div>
  );
};

export default App;