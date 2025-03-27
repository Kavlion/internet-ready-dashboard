
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NetworkProvider, useNetwork } from "@/context/NetworkContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Debtors from "./pages/Debtors";
import DebtorDetail from "./pages/DebtorDetail";
import DebtorCreate from "./pages/DebtorCreate";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Components
import PhoneFrame from "./components/PhoneFrame";
import PinScreen from "./components/PinScreen";
import LoginScreen from "./components/LoginScreen";
import NetworkError from "./components/NetworkError";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isPinAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  if (!isPinAuthenticated) {
    return <PinScreen />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const isMobile = useIsMobile();
  const { isOnline } = useNetwork();
  
  if (!isOnline) {
    return <NetworkError />;
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:p-10">
      <div className={isMobile ? "w-full h-full" : "shadow-2xl"}>
        {isMobile ? (
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/debtors" element={<ProtectedRoute><Debtors /></ProtectedRoute>} />
            <Route path="/debtors/:id" element={<ProtectedRoute><DebtorDetail /></ProtectedRoute>} />
            <Route path="/debtors/add" element={<ProtectedRoute><DebtorCreate /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <PhoneFrame>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/debtors" element={<ProtectedRoute><Debtors /></ProtectedRoute>} />
              <Route path="/debtors/:id" element={<ProtectedRoute><DebtorDetail /></ProtectedRoute>} />
              <Route path="/debtors/add" element={<ProtectedRoute><DebtorCreate /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PhoneFrame>
        )}
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NetworkProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </NetworkProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
