
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Finance App</CardTitle>
          <CardDescription className="text-center">
            Manage your debtors and finances with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm text-gray-500">
              Access your account to view your dashboard, manage debtors, 
              check your calendar, or update settings.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full"
              variant="default"
            >
              Dashboard
            </Button>
            <Button 
              onClick={() => navigate("/debtors")}
              className="w-full"
              variant="outline"
            >
              Debtors
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate("/calendar")}
              className="w-full"
              variant="outline"
            >
              Calendar
            </Button>
            <Button 
              onClick={() => navigate("/settings")}
              className="w-full"
              variant="outline"
            >
              Settings
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigate("/profile")}
            className="w-full"
            variant="ghost"
          >
            View Profile
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Finance App. All rights reserved.</p>
        <p className="mt-2">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Index;
