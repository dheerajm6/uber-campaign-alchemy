
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Settings, Key } from "lucide-react";

const AdminSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [currentApiKey, setCurrentApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('hyperleap_api_key');
    if (savedApiKey) {
      setCurrentApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('hyperleap_api_key', apiKey.trim());
      setCurrentApiKey(apiKey.trim());
      setApiKey('');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('apiKeyChanged'));
      
      console.log('=== API KEY SAVED ===');
      console.log('New API key saved:', apiKey.trim().substring(0, 10) + '...');
      console.log('Custom event dispatched');
      console.log('====================');
      
      toast({
        title: "API Key Saved",
        description: "Hyperleap API key has been saved for all users.",
      });
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('hyperleap_api_key');
    setCurrentApiKey('');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('apiKeyChanged'));
    
    console.log('=== API KEY REMOVED ===');
    console.log('API key removed from localStorage');
    console.log('Custom event dispatched');
    console.log('======================');
    
    toast({
      title: "API Key Removed",
      description: "Hyperleap API key has been removed.",
      variant: "destructive",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Admin Settings</span>
        </CardTitle>
        <CardDescription>
          Manage the Hyperleap API key for all users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Key className="w-4 h-4" />
          <AlertDescription>
            Set the Hyperleap API key once, and all users will be able to generate campaign messages without entering it.
          </AlertDescription>
        </Alert>

        {currentApiKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ API Key is configured</p>
              <p className="text-green-600 text-sm mt-1">
                Key: {currentApiKey.substring(0, 8)}...{currentApiKey.substring(currentApiKey.length - 4)}
              </p>
            </div>
            <Button 
              onClick={handleRemoveApiKey}
              variant="destructive"
              className="w-full"
            >
              Remove API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Hyperleap API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter Hyperleap API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              Save API Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
