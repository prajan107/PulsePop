import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Sparkles, 
  Grid, 
  List as ListIcon, 
  Clock, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTrends } from '@/features/trends/trendQueries';
import { TrendCard } from '@/components/trends/TrendCard';
import { TrendTable } from '@/components/trends/TrendTable';
import { TrendSkeleton } from '@/components/trends/TrendSkeleton';
import { MOCK_TRENDING_KEYWORDS } from '@/mocks/mockData';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'AI & ML', 'SaaS', 'Developer Tools', 'Crypto', 'E-Commerce'];
  const categoryIdMap: Record<string, number | undefined> = {
    'AI & ML': 1,
    'SaaS': 2,
    'Developer Tools': 3,
    'Crypto': 4,
    'E-Commerce': 5,
  };

  const sources = ['All', 'Twitter', 'Reddit', 'GitHub', 'ProductHunt', 'News'];
  const sourceIdMap: Record<string, number | undefined> = {
    'Twitter': 1,
    'Reddit': 2,
    'GitHub': 3,
    'ProductHunt': 4,
    'News': 5,
  };

  const sentiments = ['All', 'High (>80)', 'Moderate (50-80)', 'Low (<50)'];

  // Query live API backend trends via React Query
  const { data, isLoading, isError, refetch } = useTrends({
    search: searchQuery.trim() || undefined,
    category_id: categoryIdMap[selectedCategory],
    source_id: sourceIdMap[selectedSource],
    page: 1,
    page_size: 50,
  });

  const apiTrends = data?.items || [];

  // Filter client-side for sentiment score tier if selected
  const filteredTrends = apiTrends.filter((item) => {
    if (selectedSentiment === 'High (>80)') return item.trend_score >= 80;
    if (selectedSentiment === 'Moderate (50-80)') return item.trend_score >= 50 && item.trend_score < 80;
    if (selectedSentiment === 'Low (<50)') return item.trend_score < 50;
    return true;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSentiment('All');
    setSelectedSource('All');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Search Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Trend Discovery & Search Engine <Sparkles className="h-6 w-6 text-[#6366F1]" />
        </h1>
        <p className="mt-1 text-sm text-[#94A3B8]">
          Filter and query real-time AI signals, tech stack shifts, and market opportunities from live backend API.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by technology keyword, cluster title, or topic..."
          className="h-14 pl-12 pr-10 text-base rounded-xl bg-[#111827] border-[#1F2937] text-white focus-visible:ring-[#6366F1]"
          icon={<SearchIcon className="h-6 w-6 text-[#6366F1]" />}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Popular Keyword Shortcuts */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1 uppercase tracking-wider shrink-0">
          <Clock className="h-3.5 w-3.5" /> Popular:
        </span>
        {MOCK_TRENDING_KEYWORDS.map((kw) => (
          <button
            key={kw.text}
            onClick={() => setSearchQuery(kw.text)}
            className="rounded-lg border border-[#1F2937] bg-[#1E293B]/70 px-2.5 py-1 text-xs text-[#94A3B8] hover:border-[#6366F1] hover:text-white transition-all shrink-0"
          >
            {kw.text}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-[#1F2937] bg-[#111827] p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <SlidersHorizontal className="h-4 w-4 text-[#6366F1]" />
            <span>Filters</span>
          </div>

          <div className="flex items-center space-x-2">
            {(selectedCategory !== 'All' || selectedSentiment !== 'All' || selectedSource !== 'All' || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-[#EF4444] hover:text-[#EF4444]">
                Reset Filters
              </Button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-[#1F2937] bg-[#0F172A] p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#1F2937] text-white' : 'text-[#94A3B8]'}`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#1F2937] text-white' : 'text-[#94A3B8]'}`}
                title="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Trend Velocity Score</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
            >
              {sentiments.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Source Platform</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
            >
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-[#94A3B8]">
        <span>Showing <strong className="text-white">{filteredTrends.length}</strong> matching trends from backend</span>
      </div>

      {/* Results Display */}
      {isLoading ? (
        <TrendSkeleton />
      ) : isError ? (
        <Card className="border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-xs text-[#EF4444]">
          Failed to retrieve trends from backend API.
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry Search
            </Button>
          </div>
        </Card>
      ) : filteredTrends.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        ) : (
          <TrendTable trends={filteredTrends} />
        )
      ) : (
        <Card className="border-[#1F2937] bg-[#111827] p-12 text-center">
          <p className="text-base text-white font-semibold">No trends matched your search query or filter criteria.</p>
          <p className="text-xs text-[#94A3B8] mt-1">Try searching for a different keyword or resetting active filters.</p>
          <Button onClick={clearFilters} className="mt-4 bg-[#6366F1] text-white">
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
};
