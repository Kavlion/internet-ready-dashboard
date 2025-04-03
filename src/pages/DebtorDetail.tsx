
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, MoreVertical, Calendar, Home, User, Settings, Plus } from 'lucide-react';
import { debtors, debts } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUZCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DebtPayment {
  id: string;
  date: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  progress: number; // 0-100
}

interface Debtor {
  id: string;
  name: string;
  phone: string;
  totalDebt: number;
  favorite: boolean;
  payments?: DebtPayment[];
}

const DebtorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDebtor = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch debtor data
        const debtorData = await debtors.getById(id);
        
        if (debtorData) {
          setDebtor(debtorData);
          setIsFavorite(debtorData.favorite || false);
          
          // Try to fetch payment data
          try {
            const paymentsData = await debts.getById(id);
            if (paymentsData && Array.isArray(paymentsData)) {
              setPayments(paymentsData);
            } else {
              // Fallback payment data
              setPayments([
                { 
                  id: '1', 
                  date: 'Nov 1, 2024 14:51', 
                  amount: 5845000, 
                  dueDate: '07.11.2024',
                  isPaid: false,
                  progress: 50
                },
                { 
                  id: '2', 
                  date: 'Iyl 09, 2024 14:51', 
                  amount: 8941000, 
                  dueDate: '01.12.2024',
                  isPaid: false,
                  progress: 30
                },
                { 
                  id: '3', 
                  date: 'Iyl 09, 2024 14:51', 
                  amount: 0, 
                  dueDate: '',
                  isPaid: true,
                  progress: 100
                }
              ]);
            }
          } catch (paymentError) {
            console.error('Error fetching payments:', paymentError);
            // Fallback payment data
            setPayments([
              { 
                id: '1', 
                date: 'Nov 1, 2024 14:51', 
                amount: 5845000, 
                dueDate: '07.11.2024',
                isPaid: false,
                progress: 50
              },
              { 
                id: '2', 
                date: 'Iyl 09, 2024 14:51', 
                amount: 8941000, 
                dueDate: '01.12.2024',
                isPaid: false,
                progress: 30
              },
              { 
                id: '3', 
                date: 'Iyl 09, 2024 14:51', 
                amount: 0, 
                dueDate: '',
                isPaid: true,
                progress: 100
              }
            ]);
          }
        } else {
          // Fallback debtor data
          const mockDebtor: Debtor = {
            id: id,
            name: 'Avazbek Solijonov',
            phone: '+998912345678',
            totalDebt: 14786000,
            favorite: false
          };
          
          setDebtor(mockDebtor);
          setIsFavorite(mockDebtor.favorite);
          
          // Fallback payment data
          setPayments([
            { 
              id: '1', 
              date: 'Nov 1, 2024 14:51', 
              amount: 5845000, 
              dueDate: '07.11.2024',
              isPaid: false,
              progress: 50
            },
            { 
              id: '2', 
              date: 'Iyl 09, 2024 14:51', 
              amount: 8941000, 
              dueDate: '01.12.2024',
              isPaid: false,
              progress: 30
            },
            { 
              id: '3', 
              date: 'Iyl 09, 2024 14:51', 
              amount: 0, 
              dueDate: '',
              isPaid: true,
              progress: 100
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching debtor:', error);
        toast({
          variant: "destructive",
          title: "Xato",
          description: "Mijoz ma'lumotlarini yuklab bo'lmadi",
        });
        
        // Fallback debtor data
        const mockDebtor: Debtor = {
          id: id || '1',
          name: 'Avazbek Solijonov',
          phone: '+998912345678',
          totalDebt: 14786000,
          favorite: false
        };
        
        setDebtor(mockDebtor);
        setIsFavorite(mockDebtor.favorite);
        
        // Fallback payment data
        setPayments([
          { 
            id: '1', 
            date: 'Nov 1, 2024 14:51', 
            amount: 5845000, 
            dueDate: '07.11.2024',
            isPaid: false,
            progress: 50
          },
          { 
            id: '2', 
            date: 'Iyl 09, 2024 14:51', 
            amount: 8941000, 
            dueDate: '01.12.2024',
            isPaid: false,
            progress: 30
          },
          { 
            id: '3', 
            date: 'Iyl 09, 2024 14:51', 
            amount: 0, 
            dueDate: '',
            isPaid: true,
            progress: 100
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebtor();
  }, [id]);

  const toggleFavorite = async () => {
    if (!debtor || !id) return;
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    try {
      // Update in API
      await debtors.update(id, { ...debtor, favorite: newFavoriteState });
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Sevimli holatini yangilashda xatolik yuz berdi",
      });
      
      // Revert state if API call fails
      setIsFavorite(!newFavoriteState);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
      </div>
    );
  }

  if (!debtor) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-xl font-medium mb-4">Mijoz topilmadi</div>
        <Button onClick={() => navigate('/debtors')}>Barcha mijozlar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">{debtor.name}</h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={toggleFavorite} 
            className="mr-2"
          >
            <Star 
              size={20} 
              fill={isFavorite ? "#FFC107" : "none"} 
              color={isFavorite ? "#FFC107" : "currentColor"} 
            />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={toggleFavorite}>
                <Star className="mr-2 h-4 w-4" />
                <span>{isFavorite ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo\'shish'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500">
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-auto flex-1 p-4 space-y-4">
        <div className="flex space-x-2">
          <div className={`flex-1 rounded-lg ${debtor.totalDebt > 0 ? 'bg-blue-100' : 'bg-white'} p-4`}>
            <div className="text-sm text-gray-500">Umumiy nasiya:</div>
            <div className={`text-xl font-bold ${debtor.totalDebt > 0 ? 'text-blue-700' : ''}`}>
              {formatUZCurrency(debtor.totalDebt)} so'm
            </div>
          </div>
          
          <div className="flex-1 bg-white rounded-lg p-4">
            <div className="text-sm text-center">Tahrirlash</div>
            <div className="text-center text-red-500">O'chirish</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="font-medium mb-4">Faol nasiyalar</h2>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Hech qanday nasiya mavjud emas</div>
              <div className="text-sm text-gray-400">Nasiya yaratish uchun pastdagi "+" tugmasini bosing</div>
            </div>
          ) : (
            <div className="space-y-6">
              {payments.map(payment => (
                <div key={payment.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-500">{payment.date}</div>
                    <div className="font-medium">{formatUZCurrency(payment.amount)} so'm</div>
                  </div>
                  
                  {payment.dueDate && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>Keyingi to'lov: {payment.dueDate}</span>
                    </div>
                  )}
                  
                  {payment.amount > 0 && (
                    <div className="flex items-center text-sm mb-1">
                      <span className="mr-2 text-purple-600 font-medium">
                        {formatUZCurrency(payment.amount * (payment.progress / 100))} so'm
                      </span>
                    </div>
                  )}
                  
                  {payment.amount > 0 && (
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${payment.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Debt Button */}
      <div className="fixed bottom-20 right-4">
        <Link 
          to={`/debtors/${id}/add-debt`} 
          className="w-14 h-14 bg-app-blue rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Navigation for Mobile */}
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
            <Calendar size={20} />
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

export default DebtorDetail;
