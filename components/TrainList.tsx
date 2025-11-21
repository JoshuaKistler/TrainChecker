import React from 'react';
import { StationBoardEntry } from '../types.ts';
import { TrainIcon, BusIcon, TramIcon, ShipIcon, ArrowRightIcon } from './Icons.tsx';

interface TrainListProps {
  trains: StationBoardEntry[];
  loading: boolean;
  onSelectTrain: (train: StationBoardEntry) => void;
}

const getTransportIcon = (category: string) => {
  const cat = category.toUpperCase();
  if (cat === 'BUS' || cat === 'B' || cat === 'N' || cat === 'KB') return BusIcon;
  if (cat === 'T' || cat === 'TRAM') return TramIcon;
  if (['BAT', 'SHIP', 'BATO'].includes(cat)) return ShipIcon;
  return TrainIcon;
};

const TrainList: React.FC<TrainListProps> = ({ trains, loading, onSelectTrain }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse flex justify-between items-center h-20">
            <div className="flex flex-col space-y-2 w-1/3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (trains.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
        <TrainIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-lg font-medium">No trains found</p>
        <p className="text-sm">Try adjusting your search time or station.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trains.map((train, idx) => {
        const rawTime = train.stop.departure;
        
        const timeDisplay = rawTime 
          ? new Date(rawTime).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })
          : 'Unknown';

        // Delay handling
        const delay = train.stop.delay;
        const isDelayed = delay > 0;

        const TransportIcon = getTransportIcon(train.category);

        return (
          <div 
            key={`${train.name}-${idx}`} 
            onClick={() => onSelectTrain(train)}
            className="group bg-white hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between"
          >
            {/* Time & ID */}
            <div className="flex items-center space-x-4 mb-2 sm:mb-0 w-full sm:w-1/4">
              <div className="flex flex-col">
                <span className={`text-xl font-bold font-mono ${isDelayed ? 'text-red-600' : 'text-gray-900'}`}>
                  {timeDisplay}
                </span>
                {isDelayed && (
                  <span className="text-xs font-bold text-white bg-swiss-red px-1.5 rounded self-start">
                    +{delay} min
                  </span>
                )}
                <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mt-0.5">
                    Departure
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-md bg-gray-100 text-sm font-bold text-gray-700 min-w-[3.5rem] text-center flex flex-col items-center justify-center border border-gray-200">
                <TransportIcon className="h-4 w-4 text-gray-500 mb-0.5" />
                <span className="leading-none">{train.name}</span>
              </div>
            </div>

            {/* Destination / Direction */}
            <div className="flex-1 flex items-center text-gray-800 font-medium">
              <ArrowRightIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="truncate">{train.to}</span>
              </div>
            </div>

            {/* Platform */}
            <div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-between sm:justify-end items-center text-sm text-gray-500">
               <span className="mr-4 sm:hidden">Platform</span>
               <span className="font-mono font-semibold bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-700">
                 Pl. {train.stop.platform || '-'}
               </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrainList;