import React from 'react';
import { PieChart, PieChartItem } from './PieChart';

interface DonutChartProps {
  data: PieChartItem[];
  dataKey?: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  valueFormatter?: (value: number) => string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  dataKey = 'value',
  colors,
  innerRadius = 50,
  outerRadius = 80,
  valueFormatter,
}) => {
  return (
    <PieChart
      data={data}
      dataKey={dataKey}
      colors={colors}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      valueFormatter={valueFormatter}
    />
  );
};
