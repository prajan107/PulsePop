import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';

export interface BarChartItem {
  name: string;
  value: number;
  fullTitle?: string;
  [key: string]: any;
}

interface BarChartProps {
  data: BarChartItem[];
  layout?: 'horizontal' | 'vertical';
  dataKey?: string;
  colors?: string[];
  unit?: string;
  valueFormatter?: (value: number) => string;
}

const DEFAULT_COLORS = ['#6366F1', '#818CF8', '#10B981', '#F59E0B', '#38BDF8', '#EC4899', '#A855F7'];

export const BarChart: React.FC<BarChartProps> = ({
  data,
  layout = 'horizontal',
  dataKey = 'value',
  colors = DEFAULT_COLORS,
  unit = '',
  valueFormatter,
}) => {
  if (layout === 'vertical') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" horizontal={false} />
          <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<ChartTooltip unit={unit} valueFormatter={valueFormatter} />} />
          <Bar dataKey={dataKey} radius={[0, 6, 6, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
        <XAxis
          dataKey="name"
          stroke="#64748B"
          fontSize={10}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
        />
        <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
        <Tooltip content={<ChartTooltip unit={unit} valueFormatter={valueFormatter} />} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
