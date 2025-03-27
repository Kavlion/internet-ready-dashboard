
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Home, CalendarDays, Settings, Plus } from 'lucide-react';
import { debtors } from '@/services/api';

interface Debtor {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
}

const Debtors = () => {
  const [debtorsList, setDebtorsList] = useState<Debtor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setIsLoading(true);
        const data = await debtors.getAll();
        setDebtorsList(data || []); 
      } catch (error) {
        console.error('Error fetching debtors:', error);
        // Set fallback data
        setDebtorsList([
          { id: '1', name: 'Anvarjon Soliyjonov', phone: '+998555555555', totalDebt: 14786000 },
          { id: '2', name: 'Farida Karimova', phone: '+998555555556', totalDebt: 9450000 },
          { id: '3', name: 'Otabek Tohirov', phone: '+998555555557', totalDebt: 7825000 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebtors();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      const data = await debtors.getAll();
      setDebtorsList(data || []);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await debtors.search(searchQuery);
      setDebtorsList(data || []);
    } catch (error) {
      console.error('Error searching debtors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDebtors = searchQuery
    ? debtorsList.filter(debtor => 
        debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        debtor.phone.includes(searchQuery)
      )
    : debtorsList;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            onClick={handleSearch}
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
          </div>
        ) : filteredDebtors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Hech qanday natija topilmadi</h3>
            <p className="text-gray-500 text-sm mb-4">
              Boshqa parametrlar bilan qidirishni sinab ko'ring
            </p>
            <button 
              className="button-primary px-6"
              onClick={() => setSearchQuery('')}
            >
              Barcha qarzdorlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDebtors.map((debtor, index) => (
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
                        <h3 className="font-medium">{debtor.name}</h3>
                        <p className="text-sm text-gray-500">{debtor.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-app-blue">
                        {formatCurrency(debtor.totalDebt)}
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
    </div>
  );
};

export default Debtors;
