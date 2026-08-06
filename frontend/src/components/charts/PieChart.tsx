import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

export interface PieChartItem {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface PieChartProps {
  data: PieChartItem[];
  dataKey?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: number) => string;
}

const DEFAULT_COLORS = ['#10B981', '#6366F1', '#EF4444', '#F59E0B', '#38BDF8', '#EC4899'];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  dataKey = 'value',
  colors = DEFAULT_COLORS,
  innerRadius = 0,
  outerRadius = 80,
  valueFormatter,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || colors[index % colors.length]}
              stroke="#0F172A"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          formatter={(value) => <span className="text-xs text-[#94A3B8] font-medium">{value}</span>}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
