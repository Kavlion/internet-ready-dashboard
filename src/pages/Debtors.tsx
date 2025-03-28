
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Home, CalendarDays, Settings, Plus, Star } from 'lucide-react';
import { debtors } from '@/services/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatUZCurrency } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

interface Debtor {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  favorite?: boolean;
}

const Debtors = () => {
  const isMobile = useIsMobile();
  const [debtorsList, setDebtorsList] = useState<Debtor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setIsLoading(true);
        const data = await debtors.getAll();
        
        // Fallback data in case the API fails
        if (!data || data.length === 0) {
          const fallbackData = [
            { id: '1', name: 'Anvarjon Soliyjonov', phone: '+998555555555', totalDebt: 14786000, favorite: true },
            { id: '2', name: 'Farida Karimova', phone: '+998555555556', totalDebt: 9450000 },
            { id: '3', name: 'Otabek Tohirov', phone: '+998555555557', totalDebt: 7825000 },
            { id: '4', name: 'Avazbek Jahongirov', phone: '+998555555558', totalDebt: 12550000 },
            { id: '5', name: 'Nodira Azimova', phone: '+998555555559', totalDebt: 5320000 },
          ];
          setDebtorsList(fallbackData);
          
          // Set initial favorites with explicit string type
          const initialFavorites = new Set<string>(
            fallbackData.filter(d => d.favorite).map(d => d.id)
          );
          setFavoriteIds(initialFavorites);
        } else {
          setDebtorsList(data);
          
          // Set initial favorites from API data with explicit string type
          const initialFavorites = new Set<string>(
            data.filter((d: Debtor) => d.favorite).map((d: Debtor) => d.id)
          );
          setFavoriteIds(initialFavorites);
        }
      } catch (error) {
        console.error('Error fetching debtors:', error);
        // Set fallback data
        const fallbackData = [
          { id: '1', name: 'Anvarjon Soliyjonov', phone: '+998555555555', totalDebt: 14786000, favorite: true },
          { id: '2', name: 'Farida Karimova', phone: '+998555555556', totalDebt: 9450000 },
          { id: '3', name: 'Otabek Tohirov', phone: '+998555555557', totalDebt: 7825000 },
          { id: '4', name: 'Avazbek Jahongirov', phone: '+998555555558', totalDebt: 12550000 },
          { id: '5', name: 'Nodira Azimova', phone: '+998555555559', totalDebt: 5320000 },
        ];
        setDebtorsList(fallbackData);
        
        // Set initial favorites with explicit string type
        const initialFavorites = new Set<string>(
          fallbackData.filter(d => d.favorite).map(d => d.id)
        );
        setFavoriteIds(initialFavorites);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedSearch.trim()) {
        // If search is cleared, fetch all debtors again
        try {
          const data = await debtors.getAll();
          if (data && data.length > 0) {
            setDebtorsList(data);
          }
        } catch (error) {
          console.error('Error fetching all debtors:', error);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await debtors.search(debouncedSearch);
        if (data && data.length > 0) {
          setDebtorsList(data);
        } else {
          // Filter locally if API search fails
          const fallbackSearch = debtorsList.filter(debtor => 
            debtor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            debtor.phone.includes(debouncedSearch)
          );
          setDebtorsList(fallbackSearch);
        }
      } catch (error) {
        console.error('Error searching debtors:', error);
        // Local filtering fallback
        const fallbackSearch = debtorsList.filter(debtor => 
          debtor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          debtor.phone.includes(debouncedSearch)
        );
        setDebtorsList(fallbackSearch);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearch) {
      handleSearch();
    }
  }, [debouncedSearch]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavoriteIds(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
    
    // In a real app, update the database
    // debtors.update(id, { favorite: !favoriteIds.has(id) });
  };

  const sortedDebtors = useMemo(() => {
    return [...debtorsList].sort((a, b) => {
      // First sort by favorite status
      const aFav = favoriteIds.has(a.id) ? 1 : 0;
      const bFav = favoriteIds.has(b.id) ? 1 : 0;
      
      if (bFav !== aFav) {
        return bFav - aFav; // Favorites first
      }
      
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }, [debtorsList, favoriteIds]);

  return (
    <div className={`flex flex-col h-full bg-gray-50 ${!isMobile ? 'w-full max-w-none' : ''}`}>
      <div className="p-4 bg-white">
        <div className="relative">
          <Input
            type="text"
            className="pl-10"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>

      <div className={`flex-1 p-4 overflow-auto ${!isMobile ? 'px-8' : ''}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        ) : sortedDebtors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Hech qanday natija topilmadi</h3>
            <p className="text-gray-500 text-sm mb-4">
              Boshqa parametrlar bilan qidirishni sinab ko'ring
            </p>
            <Button 
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="px-6"
            >
              Barcha qarzdorlarni ko'rish
            </Button>
          </div>
        ) : (
          <div className={`space-y-4 ${!isMobile ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 space-y-0' : ''}`}>
            {sortedDebtors.map((debtor, index) => (
              <Link 
                to={`/debtors/${debtor.id}`} 
                key={debtor.id}
                className="block"
              >
                <div 
                  className="glass-card p-4 animate-scale-in" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{debtor.name}</h3>
                          <button 
                            onClick={(e) => toggleFavorite(debtor.id, e)}
                            className="ml-2"
                          >
                            <Star 
                              size={16} 
                              fill={favoriteIds.has(debtor.id) ? "#FFC107" : "none"} 
                              color={favoriteIds.has(debtor.id) ? "#FFC107" : "currentColor"} 
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">{debtor.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-app-blue">
                        {formatUZCurrency(debtor.totalDebt)}
                      </div>
                      <div className="text-xs text-gray-500">so'm</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Add Debtor Button */}
      <div className="fixed bottom-20 right-4">
        <Link 
          to="/debtors/add" 
          className="w-14 h-14 bg-app-blue rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Navigation */}
      {isMobile && (
        <div className="grid grid-cols-4 border-t border-gray-200 bg-white">
          <Link to="/" className="flex flex-col items-center py-3 text-gray-500">
            <Home size={20} />
            <span className="text-xs mt-1">Asosiy</span>
          </Link>
          <Link to="/debtors" className="flex flex-col items-center py-3 text-app-blue">
            <User size={20} />
            <span className="text-xs mt-1">Qarzdorlar</span>
          </Link>
          <Link to="/calendar" className="flex flex-col items-center py-3 text-gray-500">
            <CalendarDays size={20} />
            <span className="text-xs mt-1">Kalendar</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center py-3 text-gray-500">
            <Settings size={20} />
            <span className="text-xs mt-1">Sozlamalar</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Debtors;
