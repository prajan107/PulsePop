import React from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
  valueFormatter?: (value: number) => string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  unit = '',
  valueFormatter,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const fullTitle = data.payload.fullTitle || data.payload.fullTopic || label;
    const formattedValue = valueFormatter ? valueFormatter(data.value) : `${data.value}${unit}`;

    return (
      <div className="rounded-xl border border-[#1F2937] bg-[#0F172A]/95 p-3 shadow-xl backdrop-blur-md text-xs text-[#F8FAFC]">
        <p className="font-bold text-white mb-1">{fullTitle}</p>
        <p className="text-[#818CF8] font-mono">
          <span className="text-[#94A3B8]">{data.name || 'Value'}: </span>
          {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};
