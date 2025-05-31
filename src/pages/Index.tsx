
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import AdminSettings from "@/components/AdminSettings";
import CampaignBuilder from "@/components/CampaignBuilder";
import Dashboard from "@/components/Dashboard";
import UserTargeting from "@/components/UserTargeting";
import { BarChart3, MessageSquare, Users, Settings, LogOut } from "lucide-react";

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [apiKey, setApiKey] = useState<string>("");

  // Check if API key exists on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('hyperleap_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // For regular users, check if API key is available
  if (user?.role === 'user' && !apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Uber Campaign Console</CardTitle>
            <CardDescription>
              AI-powered marketing campaign management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                The administrator needs to configure the Hyperleap API key before you can use the campaign features.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Campaign Console</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.username} ({user?.role})
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className={`grid w-full ${user?.role === 'admin' ? 'grid-cols-5' : 'grid-cols-4'} lg:w-auto`}>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>User Targeting</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignBuilder apiKey={apiKey} />
          </TabsContent>

          <TabsContent value="targeting">
            <UserTargeting />
          </TabsContent>

          <TabsContent value="analytics">
            <Dashboard />
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="admin">
              <AdminSettings />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
