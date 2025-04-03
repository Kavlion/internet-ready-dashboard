
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Home, CalendarDays, Settings, Plus, Star, Menu, Folder, Eye } from 'lucide-react';
import { debtors, stores } from '@/services/api';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatUZCurrency } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';

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
  const [totalStoreDebt, setTotalStoreDebt] = useState<number>(0);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setIsLoading(true);
        const data = await debtors.getAll();
        
        if (data && data.length > 0) {
          setDebtorsList(data);
          
          // Set initial favorites from API data
          const initialFavorites = new Set<string>(
            data.filter((d: Debtor) => d.favorite).map((d: Debtor) => d.id)
          );
          setFavoriteIds(initialFavorites);
        } else {
          // Fallback data in case the API fails
          const fallbackData = [
            { id: '1', name: 'Lutfulloh To\'rayev', phone: '+998 91 123 45 67', totalDebt: 56861000, favorite: true },
            { id: '2', name: 'Rahmatulloh Madraximov', phone: '+998 91 123 45 67', totalDebt: 800000, favorite: true },
            { id: '3', name: 'Avabek Solijonov', phone: '+998 91 123 45 67', totalDebt: 14786000 },
            { id: '4', name: 'Madina Mavlonova', phone: '+998 91 123 45 67', totalDebt: 14786000 },
            { id: '5', name: 'Otabek Sulaymonov', phone: '+998 91 123 45 67', totalDebt: 10000000 },
          ];
          setDebtorsList(fallbackData);
          
          // Set initial favorites with explicit string type
          const initialFavorites = new Set<string>(
            fallbackData.filter(d => d.favorite).map(d => d.id)
          );
          setFavoriteIds(initialFavorites);
        }
      } catch (error) {
        console.error('Error fetching debtors:', error);
        // Set fallback data
        const fallbackData = [
          { id: '1', name: 'Lutfulloh To\'rayev', phone: '+998 91 123 45 67', totalDebt: 56861000, favorite: true },
          { id: '2', name: 'Rahmatulloh Madraximov', phone: '+998 91 123 45 67', totalDebt: 800000, favorite: true },
          { id: '3', name: 'Avabek Solijonov', phone: '+998 91 123 45 67', totalDebt: 14786000 },
          { id: '4', name: 'Madina Mavlonova', phone: '+998 91 123 45 67', totalDebt: 14786000 },
          { id: '5', name: 'Otabek Sulaymonov', phone: '+998 91 123 45 67', totalDebt: 10000000 },
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

    const fetchTotalDebt = async () => {
      try {
        const storeData = await stores.getStoreDebts();
        if (storeData && typeof storeData.totalDebt === 'number') {
          setTotalStoreDebt(storeData.totalDebt);
        }
      } catch (error) {
        console.error('Error fetching total debt:', error);
        // Fallback value
        setTotalStoreDebt(135214200);
      }
    };

    fetchDebtors();
    fetchTotalDebt();
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

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isFavorite = favoriteIds.has(id);
    setFavoriteIds(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
    
    // Update the database
    try {
      const debtor = debtorsList.find(d => d.id === id);
      if (debtor) {
        await debtors.update(id, { ...debtor, favorite: !isFavorite });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        title: "Xatolik",
        description: "Sevimlilar ro'yxatini yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
      
      // Revert UI state if API fails
      setFavoriteIds(prev => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.add(id);
        } else {
          newFavorites.delete(id);
        }
        return newFavorites;
      });
    }
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
    <div className="flex flex-col h-full bg-white w-full">
      <div className="p-4 bg-white flex items-center justify-between shadow-sm">
        <div className="relative flex-1 max-w-lg">
          <Input
            type="text"
            className="pl-10 rounded-lg"
            placeholder={isMobile ? "Qidirish..." : "Mijozlarni qidirish..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
        
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Menu size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2 w-full">
                  <Home size={16} />
                  <span>Asosiy</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/debtors" className="flex items-center gap-2 w-full">
                  <User size={16} />
                  <span>Qarzdorlar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/calendar" className="flex items-center gap-2 w-full">
                  <CalendarDays size={16} />
                  <span>Kalendar</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 w-full">
                  <Settings size={16} />
                  <span>Sozlamalar</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex-1 p-4 overflow-auto w-full">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {sortedDebtors.map((debtor, index) => (
              <Link 
                to={`/debtors/${debtor.id}`} 
                key={debtor.id}
                className="block w-full"
              >
                <div 
                  className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm h-full flex flex-col" 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-base">{debtor.name}</h3>
                        <button 
                          onClick={(e) => toggleFavorite(debtor.id, e)}
                          className="ml-2 focus:outline-none"
                        >
                          <Star 
                            size={16} 
                            fill={favoriteIds.has(debtor.id) ? "#FFC107" : "none"} 
                            color={favoriteIds.has(debtor.id) ? "#FFC107" : "#9CA3AF"} 
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">{debtor.phone}</p>
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Jami nasiya:</p>
                        <p className="text-base font-semibold text-red-500">
                          -{formatUZCurrency(Math.abs(debtor.totalDebt))} so'm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Card - For second image implementation */}
      {!isMobile && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg bg-green-500 text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{formatUZCurrency(totalStoreDebt)} so'm</h2>
              <p className="text-white text-opacity-80">Umumiy nasiya:</p>
            </div>
            <Eye size={24} className="text-white" />
          </div>
        </div>
      )}

      {/* Add Debtor Button - Fixed at bottom right */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6">
        <Link 
          to="/debtors/add" 
          className={`${isMobile ? 'w-14 h-14 rounded-full' : 'px-5 py-3 rounded-lg'} bg-[#4285F4] flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors`}
        >
          {isMobile ? (
            <Plus size={24} />
          ) : (
            <>
              <User size={18} className="mr-2" />
              <span>Yaratish</span>
            </>
          )}
        </Link>
      </div>

      {/* Bottom Navigation for Mobile Only */}
      {isMobile && (
        <div className="grid grid-cols-4 border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0">
          <Link to="/" className="flex flex-col items-center py-3 text-gray-500">
            <Home size={20} />
            <span className="text-xs mt-1">Asosiy</span>
          </Link>
          <Link to="/debtors" className="flex flex-col items-center py-3 text-app-blue">
            <User size={20} />
            <span className="text-xs mt-1">Mijozlar</span>
          </Link>
          <Link to="/calendar" className="flex flex-col items-center py-3 text-gray-500">
            <Folder size={20} />
            <span className="text-xs mt-1">Hisobot</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center py-3 text-gray-500">
            <Settings size={20} />
            <span className="text-xs mt-1">Sozlama</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Debtors;
