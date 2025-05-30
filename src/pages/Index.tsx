
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CampaignBuilder from "@/components/CampaignBuilder";
import Dashboard from "@/components/Dashboard";
import UserTargeting from "@/components/UserTargeting";
import { BarChart3, MessageSquare, Users, Settings } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('hyperleap_api_key', apiKey);
      setIsApiKeySet(true);
    }
  };

  // Check if API key exists on component mount
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('hyperleap_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  if (!isApiKeySet) {
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
                Please enter your Hyperleap API key to enable AI message generation.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Hyperleap API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
              />
            </div>
            <Button 
              onClick={handleApiKeySubmit} 
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={!apiKey.trim()}
            >
              Continue
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
              <p className="text-sm text-gray-600">AI-powered marketing campaigns</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              localStorage.removeItem('hyperleap_api_key');
              setIsApiKeySet(false);
              setApiKey('');
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
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
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
