import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Filter, 
  Sparkles, 
  Grid, 
  List as ListIcon, 
  ArrowUpRight, 
  Clock, 
  Tag, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MOCK_TRENDS, MOCK_TRENDING_KEYWORDS } from '@/mocks/mockData';
import { formatNumber } from '@/utils/cn';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'AI & ML', 'SaaS', 'Developer Tools', 'Crypto', 'E-Commerce'];
  const sentiments = ['All', 'High (>80)', 'Moderate (50-80)', 'Low (<50)'];
  const sources = ['All', 'Twitter', 'GitHub', 'Reddit', 'ProductHunt', 'News'];

  const filteredTrends = MOCK_TRENDS.filter((item) => {
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topKeywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSource = selectedSource === 'All' || item.sources.includes(selectedSource as any);
    
    let matchesSentiment = true;
    if (selectedSentiment === 'High (>80)') matchesSentiment = item.sentimentScore >= 80;
    if (selectedSentiment === 'Moderate (50-80)') matchesSentiment = item.sentimentScore >= 50 && item.sentimentScore < 80;
    if (selectedSentiment === 'Low (<50)') matchesSentiment = item.sentimentScore < 50;

    return matchesQuery && matchesCategory && matchesSource && matchesSentiment;
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
          Filter and query thousands of AI signals, tech stack shifts, and market opportunities.
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

      {/* Recent & Trending Searches */}
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

        {/* Filter Dropdown Selectors */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Category Filter */}
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

          {/* Sentiment Filter */}
          <div>
            <label className="text-xs text-[#94A3B8] mb-1 block">Sentiment Score</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full rounded-lg border border-[#1F2937] bg-[#0F172A] px-3 py-2 text-xs text-white outline-none focus:border-[#6366F1]"
            >
              {sentiments.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Source Platform Filter */}
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

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-sm text-[#94A3B8]">
        <span>Showing <strong className="text-white">{filteredTrends.length}</strong> matching trends</span>
      </div>

      {/* Results Grid / List */}
      {filteredTrends.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrends.map((trend) => (
              <Card
                key={trend.id}
                onClick={() => navigate(`/trends/${trend.id}`)}
                className="group flex flex-col justify-between border-[#1F2937] bg-[#111827] p-5 cursor-pointer transition-all duration-300 hover:border-[#6366F1] hover:shadow-xl hover:shadow-[#6366F1]/10"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-[#1E293B] text-[#818CF8]">
                      {trend.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-xs font-bold text-[#34D399]">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>+{trend.growthPercentage}%</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#6366F1] transition-colors">
                    {trend.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {trend.summary}
                  </p>
                </div>

                <div className="mt-4 border-t border-[#1F2937] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Sentiment Score</span>
                    <span className="font-semibold text-white">{trend.sentimentScore}/100</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Indexed Volume</span>
                    <span className="font-mono text-white">{formatNumber(trend.volume)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {trend.sources.map((s) => (
                      <span key={s} className="rounded bg-[#0F172A] px-1.5 py-0.5 text-[10px] text-[#94A3B8] border border-[#1F2937]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTrends.map((trend) => (
              <Card
                key={trend.id}
                onClick={() => navigate(`/trends/${trend.id}`)}
                className="flex items-center justify-between border-[#1F2937] bg-[#111827] p-4 cursor-pointer transition-all hover:border-[#6366F1]"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-white text-base">{trend.title}</h3>
                    <Badge variant="secondary" className="bg-[#1E293B] text-xs">
                      {trend.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#94A3B8] line-clamp-1">{trend.summary}</p>
                </div>

                <div className="flex items-center space-x-6 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#34D399]">+{trend.growthPercentage}%</div>
                    <div className="text-[10px] text-[#64748B]">{formatNumber(trend.volume)} mentions</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#6366F1]">
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card className="border-[#1F2937] bg-[#111827] p-12 text-center">
          <p className="text-base text-white font-semibold">No trends matched your filter criteria.</p>
          <p className="text-xs text-[#94A3B8] mt-1">Try clearing your filters or searching for another keyword.</p>
          <Button onClick={clearFilters} className="mt-4 bg-[#6366F1] text-white">
            Reset Filters
          </Button>
        </Card>
      )}
    </div>
  );
};
