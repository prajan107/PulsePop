import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_CHART_DATA } from '@/mocks/mockData';

export const SentimentPieChart: React.FC = () => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#F8FAFC]">Overall Sentiment Distribution</CardTitle>
        <CardDescription className="text-xs text-[#94A3B8]">AI NLP sentiment score breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:flex-row justify-between">
          <div className="h-52 w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_CHART_DATA.sentimentPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_CHART_DATA.sentimentPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#111827" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1F2937',
                    borderRadius: '10px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Ratio']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-3 w-full sm:w-auto mt-4 sm:mt-0">
            {MOCK_CHART_DATA.sentimentPie.map((item) => (
              <div key={item.name} className="flex items-center justify-between space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-[#F8FAFC]">{item.name}</span>
                </div>
                <span className="font-bold text-[#94A3B8]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
