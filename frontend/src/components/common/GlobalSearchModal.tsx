import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, ArrowRight, Sparkles, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MOCK_TRENDS, MOCK_TRENDING_KEYWORDS } from '@/mocks/mockData';
import { Badge } from '@/components/ui/badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = query.trim() 
    ? MOCK_TRENDS.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.summary.toLowerCase().includes(query.toLowerCase()))
    : MOCK_TRENDS;

  const handleSelect = (id: string) => {
    onClose();
    navigate(`/trends/${id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 gap-0 border-[#1F2937] bg-[#111827] overflow-hidden">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-[#1F2937]">
          <Search className="h-5 w-5 text-[#6366F1] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a trend, technology, or category..."
            className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#94A3B8] hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Trending Keywords */}
        {!query && (
          <div className="p-4 border-b border-[#1F2937] bg-[#0F172A]/50">
            <p className="text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider">Trending Searches</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_TRENDING_KEYWORDS.slice(0, 5).map((kw) => (
                <button
                  key={kw.text}
                  onClick={() => setQuery(kw.text)}
                  className="inline-flex items-center space-x-1.5 rounded-lg border border-[#1F2937] bg-[#1E293B] px-2.5 py-1 text-xs text-[#94A3B8] hover:border-[#6366F1] hover:text-white transition-all"
                >
                  <Sparkles className="h-3 w-3 text-[#6366F1]" />
                  <span>{kw.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#1F2937]">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-[#1E293B] transition-colors group"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-white group-hover:text-[#6366F1] transition-colors">
                      {item.title}
                    </span>
                    <Badge variant="secondary" className="bg-[#1E293B] text-[10px]">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{item.summary}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#94A3B8] group-hover:text-[#6366F1] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-[#94A3B8]">
              No matching trends found for "{query}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
