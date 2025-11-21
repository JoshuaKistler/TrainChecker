import React, { useEffect } from 'react';
import { StationBoardEntry } from '../types.ts';
import { XIcon, TrainIcon } from './Icons.tsx';

interface TrainDetailModalProps {
  train: StationBoardEntry | null;
  onClose: () => void;
}

const TrainDetailModal: React.FC<TrainDetailModalProps> = ({ train, onClose }) => {
  // Lock body scroll
  useEffect(() => {
    if (train) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [train]);

  if (!train) return null;

  // Format helper
  const fmtTime = (iso: string | null) => 
    iso ? new Date(iso).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="bg-swiss-red text-white p-5 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 opacity-90 mb-1">
              <TrainIcon className="h-5 w-5" />
              <span className="font-semibold tracking-wide uppercase">{train.category} {train.number}</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight">To {train.to}</h2>
            <p className="text-red-100 text-sm mt-1">Operator: {train.operator}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Route List */}
        <div className="overflow-y-auto p-0">
           <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-gray-200 z-0"></div>

              <div className="space-y-0">
                {/* Current Station (Departure) */}
                 <div className="relative flex items-center py-4 px-6 hover:bg-gray-50 transition-colors z-10 bg-white border-b border-gray-100">
                  <div className="w-16 text-right text-lg font-bold text-gray-900 mr-6">
                     {fmtTime(train.stop.departure)}
                  </div>
                  <div className="absolute left-8 w-3 h-3 bg-swiss-red rounded-full border-2 border-white shadow transform -translate-x-1/2"></div>
                  <div className="flex-1">
                     <div className="font-bold text-gray-900 text-lg">{train.stop.station.name}</div>
                     <div className="text-sm text-swiss-red font-medium">Departure Station</div>
                  </div>
                  <div className="text-gray-500 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                    Pl. {train.stop.platform}
                  </div>
                </div>

                {/* Passing Stops */}
                {train.passList && train.passList.map((stop, idx) => (
                  <div key={`${stop.station.id}-${idx}`} className="relative flex items-center py-3 px-6 hover:bg-gray-50 transition-colors z-10 bg-white">
                    <div className="w-16 text-right text-sm font-medium text-gray-500 mr-6">
                      {fmtTime(stop.departure || stop.arrival)}
                    </div>
                    <div className="absolute left-8 w-2 h-2 bg-white border-2 border-gray-300 rounded-full transform -translate-x-1/2"></div>
                    <div className="flex-1">
                      <div className="text-gray-700">{stop.station.name}</div>
                    </div>
                  </div>
                ))}

                 {/* Final Destination Marker (Visual only if not in passlist) */}
                  <div className="relative flex items-center py-4 px-6 hover:bg-gray-50 transition-colors z-10 bg-white border-t border-gray-100">
                  <div className="w-16 text-right text-sm font-medium text-gray-400 mr-6">
                     --:--
                  </div>
                  <div className="absolute left-8 w-3 h-3 bg-gray-900 rounded-full border-2 border-white shadow transform -translate-x-1/2"></div>
                  <div className="flex-1">
                     <div className="font-bold text-gray-900">{train.to}</div>
                     <div className="text-xs text-gray-400 uppercase tracking-wider">Destination</div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-200">
          Real-time data provided by transport.opendata.ch
        </div>
      </div>
    </div>
  );
};

export default TrainDetailModal;