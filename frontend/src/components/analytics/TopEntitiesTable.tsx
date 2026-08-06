import React from 'react';
import { Cpu, Layers } from 'lucide-react';
import { TrendingEntity } from '@/features/analytics/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopEntitiesTableProps {
  entities: TrendingEntity[];
}

export const TopEntitiesTable: React.FC<TopEntitiesTableProps> = ({ entities }) => {
  return (
    <Card className="border-[#1F2937] bg-[#111827]/80 backdrop-blur-xl">
      <CardHeader className="pb-3 border-b border-[#1F2937]">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-[#38BDF8]" /> Top Extracted Entities
        </CardTitle>
        <p className="text-xs text-[#94A3B8]">
          Named entities, organizations, and tech concepts identified by NLP pipelines
        </p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs text-[#CBD5E1]">
          <thead className="bg-[#0F172A]/70 text-[#64748B] uppercase font-bold text-[10px] tracking-wider border-b border-[#1F2937]">
            <tr>
              <th scope="col" className="px-4 py-3">Entity Name</th>
              <th scope="col" className="px-4 py-3">Type</th>
              <th scope="col" className="px-4 py-3">Occurrences</th>
              <th scope="col" className="px-4 py-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {entities.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#1F2937]/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-white">
                  {item.entity_name}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#1F2937] px-2 py-0.5 text-[10px] font-medium text-[#818CF8]">
                    <Layers className="h-3 w-3" /> {item.entity_type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[#CBD5E1]">
                  {item.count}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-[#10B981]">
                  {(item.average_confidence * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
