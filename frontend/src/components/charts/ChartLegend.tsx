import React from 'react';

interface LegendItem {
  name: string;
  color: string;
}

interface ChartLegendProps {
  payload?: any[];
  items?: LegendItem[];
}

export const ChartLegend: React.FC<ChartLegendProps> = ({ payload, items }) => {
  const list = items || payload || [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      {list.map((entry, index) => {
        const name = entry.value || entry.name;
        const color = entry.color;
        return (
          <div key={`item-${index}`} className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
};
