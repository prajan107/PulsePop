import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TrendSearchProps {
  value?: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export const TrendSearch: React.FC<TrendSearchProps> = ({
  value = '',
  onSearchChange,
  placeholder = 'Search trends by title or summary...',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setSearchTerm(newVal);
    onSearchChange(newVal);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        icon={<Search className="h-4 w-4 text-[#94A3B8]" />}
        endIcon={
          searchTerm ? (
            <button
              onClick={handleClear}
              type="button"
              className="text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : undefined
        }
        className="bg-[#111827]/80 border-[#1F2937] text-xs h-10"
      />
    </div>
  );
};
