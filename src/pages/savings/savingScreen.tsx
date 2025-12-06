import React, { useState, useMemo, useCallback } from 'react';
import {
  LucideClipboardList,
  LucideSearch,
  LucideChevronDown,
  LucideClock,
} from 'lucide-react';

// --- 1. Types and Interfaces ---

interface SavingsEntry {
  // Renamed ID to UIN (Unique Identification Number) for savings context
  uin: string; 
  savingsName: string; 
  amount: number;
  date: string; // ISO Date string for the transaction date/filtering (equivalent to createdAt)
}

type FilterOption = 'All Time' | 'This Month' | 'This Week' | 'This Year' | 'Last Six Months';

// --- 2. Mock Data and Helpers ---

const mockSavings: SavingsEntry[] = [
  { uin: '25736536934', savingsName: 'Vacation funds', amount: 5000.00, date: '2025-04-30' },
  { uin: '25736536934', savingsName: 'Vacation funds', amount: 5000.00, date: '2025-04-25' },
  { uin: '25736536934', savingsName: 'Emergency funds', amount: 2500.00, date: '2025-05-01' },
  { uin: '25736536934', savingsName: 'Retirement fund', amount: 10000.00, date: '2025-05-15' },
  { uin: '25736536934', savingsName: 'Vacation funds', amount: 5000.00, date: '2025-06-05' },
  { uin: '25736536934', savingsName: 'Emergency funds', amount: 2500.00, date: '2025-06-15' },
  { uin: '25736536934', savingsName: 'Retirement fund', amount: 10000.00, date: '2025-06-28' },
];

/**
 * Calculates the start date for filtering based on the selected option.
 * @param filter The selected filter option.
 * @returns A Date object representing the start of the filter period.
 */
const getStartDate = (filter: FilterOption): Date | null => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'This Week':
      // Go back to the start of the week (Sunday)
      date.setDate(date.getDate() - date.getDay());
      return date;
    case 'This Month':
      date.setDate(1);
      return date;
    case 'Last Six Months':
      date.setMonth(date.getMonth() - 6);
      return date;
    case 'This Year':
      date.setMonth(0, 1);
      return date;
    case 'All Time':
    default:
      return null;
  }
};

// --- 3. Filter Dropdown Component (Hoisted) ---

interface FilterProps {
  currentFilter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  options: FilterOption[];
}

const FilterDropdown: React.FC<FilterProps> = ({ currentFilter, setFilter, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-10">
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm font-medium text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LucideClock className="w-4 h-4 mr-2" />
        {currentFilter}
        <LucideChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-700"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setFilter(option);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition duration-100 ${
                  currentFilter === option
                    ? 'bg-[#f6ee0c] text-black font-semibold'
                    : 'text-gray-700 hover:bg-neutral-200'
                }`}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 4. Main Component ---

const SavingsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('This Month');

  // List of all possible filter options
  const filterOptions: FilterOption[] = [
    'This Week',
    'This Month',
    'Last Six Months',
    'This Year',
    'All Time',
  ];

  // Memoized function to perform filtering and searching
  const filteredSavings = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const startDate = getStartDate(currentFilter);

    return mockSavings
      .filter((entry) => {
        // 1. Date Filtering
        if (startDate) {
          // Use entry.date for filtering
          const entryDate = new Date(entry.date); 
          if (entryDate < startDate) {
            return false;
          }
        }

        // 2. Search Filtering (by name or UIN)
        if (searchLower === '') return true;

        return (
          entry.savingsName.toLowerCase().includes(searchLower) ||
          entry.uin.toLowerCase().includes(searchLower)
        );
      })
      // Sort by newest date first
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 
  }, [searchTerm, currentFilter]);

  // Handler for setting the filter (passed to the Dropdown)
  const handleSetFilter = useCallback((filter: FilterOption) => {
    setCurrentFilter(filter);
  }, []);

  // Handler for search input
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  return (
    <div className="min-h-screen bg-white text-black  p-4 sm:p-8 font-sans flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-200  ">
        {/* Header */}
        <h1 className="text-3xl font-extrabold mb-8 text-[#938E07] flex items-center border-b border-neutral-700 pb-4">
          <LucideClipboardList className="w-7 h-7 mr-3" /> Savings (Daily Pay)
        </h1>

        {/* Controls: Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search savings name or UIN..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-neutral-300  pl-10 pr-4 py-2  focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150"
            />
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>

          <FilterDropdown
            currentFilter={currentFilter}
            setFilter={handleSetFilter}
            options={filterOptions}
          />
        </div>

        {/* Savings Table */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200 shadow-lg">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Unique Identification Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Savings Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-black divide-y divide-neutral-200">
              {filteredSavings.length > 0 ? (
                filteredSavings.map((entry, index) => (
                  <tr key={index} className="hover:bg-neutral-100 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {entry.uin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.savingsName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-lg">
                    No savings entries found for the selected filter and search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavingsDashboard;