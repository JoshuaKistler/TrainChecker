import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StationBoardEntry } from '../types.ts';

interface StatsChartProps {
  trains: StationBoardEntry[];
  startHour: number; // 0-23
}

const StatsChart: React.FC<StatsChartProps> = ({ trains, startHour }) => {
    // Group trains by 15-minute buckets starting from the hour of the first train
    const data = useMemo(() => {
        if(trains.length === 0) return [];

        const buckets = new Map<string, number>();
        
        trains.forEach(t => {
            if(!t.stop.departure) return;
            const date = new Date(t.stop.departure);
            const h = date.getHours();
            const m = date.getMinutes();
            // Round to nearest 15m
            const quarter = Math.floor(m / 15) * 15;
            const timeLabel = `${h}:${quarter.toString().padStart(2, '0')}`;
            
            buckets.set(timeLabel, (buckets.get(timeLabel) || 0) + 1);
        });

        // Sort buckets by time
        return Array.from(buckets.entries())
            .map(([time, count]) => ({ time, count }))
            .sort((a, b) => a.time.localeCompare(b.time));

    }, [trains]);

    if (data.length < 2) return null;

    return (
        <div className="h-32 w-full mt-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Departures per 15 min</p>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis 
                        dataKey="time" 
                        tick={{fontSize: 10, fill: '#9CA3AF'}} 
                        axisLine={false} 
                        tickLine={false}
                    />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                        cursor={{fill: '#F3F4F6'}}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#EB0000" opacity={0.6 + (index / data.length) * 0.4} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatsChart;