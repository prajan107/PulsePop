import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass, Inbox, SearchX } from 'lucide-react';
import { useTrends } from '@/features/trends/trendQueries';
import { TrendFilterParams } from '@/features/trends/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendCard } from '@/components/trends/TrendCard';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { TrendSearch } from '@/components/trends/TrendSearch';
import { TrendSkeleton } from '@/components/trends/TrendSkeleton';
import { TrendTable } from '@/components/trends/TrendTable';

export const TrendsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL search parameters
  const filters: TrendFilterParams = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
      source_id: searchParams.get('source_id') ? Number(searchParams.get('source_id')) : undefined,
      sort_by: searchParams.get('sort_by') || 'created_at',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      page_size: searchParams.get('page_size') ? Number(searchParams.get('page_size')) : 10,
    };
  }, [searchParams]);

  const { data, isLoading, isError, refetch } = useTrends(filters);

  // Synchronize state changes to URL query parameters
  const handleFilterChange = (newFilters: Partial<TrendFilterParams>) => {
    const updatedParams = new URLSearchParams(searchParams);

    const merged = { ...filters, ...newFilters };

    Object.entries(merged).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== null && val !== 1) {
        // Don't clutter URL with page=1 if default
        if (key === 'page' && val === 1) {
          updatedParams.delete('page');
        } else {
          updatedParams.set(key, String(val));
        }
      } else {
        updatedParams.delete(key);
      }
    });

    setSearchParams(updatedParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const trends = data?.items || [];
  const totalPages = data?.total_pages || 1;
  const currentPage = data?.page || 1;
  const hasActiveFilters = !!(filters.search || filters.category_id || filters.source_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F2937]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6366F1]/10 px-3 py-1 text-xs font-semibold text-[#818CF8]">
            <Compass className="h-3.5 w-3.5 text-[#6366F1]" /> Signal Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trend Explorer
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Browse, search, and filter real-time social signals and AI topic clusters.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="space-y-3">
        <TrendSearch
          value={filters.search}
          onSearchChange={(q) => handleFilterChange({ search: q, page: 1 })}
        />
        <TrendFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <TrendSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-xs text-[#EF4444]">
          Failed to load trends from backend API. Please check service connectivity.
          <div className="mt-3">
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      ) : trends.length === 0 ? (
        <Card className="border-[#1F2937] bg-[#111827]/80 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10 text-[#818CF8]">
              {hasActiveFilters ? <SearchX className="h-6 w-6" /> : <Inbox className="h-6 w-6" />}
            </div>
            <h3 className="text-base font-bold text-white">
              {hasActiveFilters ? 'No matching trends found' : 'No trends available'}
            </h3>
            <p className="text-xs text-[#94A3B8] max-w-sm">
              {hasActiveFilters
                ? `No trends match your current query "${filters.search || 'filters'}". Try clearing your search parameters or selecting a different category.`
                : 'The platform has not ingested or generated any trends yet.'}
            </p>
            {hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="mt-2">
                Clear Filters & Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {trends.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <TrendTable trends={trends} />
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-[#1F2937] pt-4 text-xs">
            <span className="text-[#94A3B8]">
              Showing <span className="font-semibold text-white">{trends.length}</span> of{' '}
              <span className="font-semibold text-white">{data?.total || 0}</span> trends
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handleFilterChange({ page: currentPage - 1 })}
                className="border-[#1F2937] text-xs h-8"
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Prev
              </Button>
              <span className="text-xs font-semibold text-[#818CF8] px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handleFilterChange({ page: currentPage + 1 })}
                className="border-[#1F2937] text-xs h-8"
              >
                Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
