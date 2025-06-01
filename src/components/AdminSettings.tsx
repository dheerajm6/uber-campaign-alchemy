
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Key, ExternalLink } from "lucide-react";

const AdminSettings = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Admin Settings</span>
        </CardTitle>
        <CardDescription>
          Manage the Hyperleap API key and other settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Key className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Hyperleap API Key Configuration</p>
              <p className="text-sm">
                The Hyperleap API key is now managed securely through Supabase Edge Function Secrets.
                Please add your API key as a secret named <code className="bg-gray-100 px-1 rounded">HYPERLEAP_API_KEY</code> in the Supabase dashboard.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Configure API Key in Supabase</p>
              <p className="text-blue-600 text-sm mt-1">
                Add your Hyperleap API key to the Edge Function Secrets in your Supabase project dashboard.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
