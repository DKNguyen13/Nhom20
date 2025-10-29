import React, { useState, useCallback, useEffect } from 'react';
import { Search  as SearchIcon, X } from 'lucide-react';

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceTime?: number;
  className?: string;
  initialValue?: string;
  showClearButton?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Tìm kiếm...",
  onSearch,
  debounceTime = 500,
  className = "",
  initialValue = "",
  showClearButton = true,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchValue, debounceTime]);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    setDebouncedValue("");
  };

  // Variant styles
  const variantStyles = {
    default: "border border-gray-300 bg-white focus-within:border-blue-500",
    outlined: "border-2 border-gray-400 bg-transparent focus-within:border-blue-600",
    filled: "border-0 bg-gray-100 focus-within:bg-gray-200",
  };

  // Size styles
  const sizeStyles = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <div
      className={`
        flex items-center gap-2 px-3 rounded-lg transition-all
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <SearchIcon 
        size={iconSize[size] as number} 
        className={`text-gray-400 flex-shrink-0 ${loading ? 'animate-pulse' : ''}`}
      />
      
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent outline-none border-none text-gray-700 placeholder-gray-400 disabled:cursor-not-allowed"
      />

      {showClearButton && searchValue && !disabled && (
        <button
          onClick={handleClear}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
          aria-label="Clear search"
        >
          <X size={iconSize[size] - 4} />
        </button>
      )}
    </div>
  );
};

export default Search;

// Example usage component
export function SearchExample() {
  const [results, setResults] = useState<string>('');

  const handleSearch = (query: string) => {
    setResults(query ? `Searching for: "${query}"` : 'Type to search...');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Search Component Demo</h2>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Default Variant</h3>
          <Search onSearch={handleSearch} placeholder="Search tests..." />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Outlined Variant</h3>
          <Search
            onSearch={handleSearch} 
            variant="outlined"
            placeholder="Search with outline..."
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Filled Variant</h3>
          <Search
            onSearch={handleSearch} 
            variant="filled"
            placeholder="Search with filled background..."
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Different Sizes</h3>
          <Search onSearch={handleSearch} size="sm" placeholder="Small size" />
          <Search onSearch={handleSearch} size="md" placeholder="Medium size" />
          <Search onSearch={handleSearch} size="lg" placeholder="Large size" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Loading State</h3>
          <Search onSearch={handleSearch} loading placeholder="Loading..." />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Disabled State</h3>
          <Search onSearch={handleSearch} disabled placeholder="Disabled" />
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">{results || 'Type to search...'}</p>
        </div>
      </div>
    </div>
  );
}