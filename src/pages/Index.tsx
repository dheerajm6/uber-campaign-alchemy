
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import AdminSettings from "@/components/AdminSettings";
import CampaignBuilder from "@/components/CampaignBuilder";
import Dashboard from "@/components/Dashboard";
import UserTargeting from "@/components/UserTargeting";
import Analytics from "@/components/Analytics";
import { BarChart3, MessageSquare, Users, Settings, LogOut } from "lucide-react";

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
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
                Welcome, {user?.username}!
                {user?.role === 'admin' && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Admin
                  </span>
                )}
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
          <TabsList className={`grid w-full ${user?.role === 'admin' ? 'grid-cols-5' : 'grid-cols-3'} lg:w-auto`}>
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
            {user?.role === 'admin' && (
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
            )}
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
            <CampaignBuilder />
          </TabsContent>

          <TabsContent value="targeting">
            <UserTargeting />
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>
          )}

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
