
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Key, ExternalLink } from "lucide-react";

const AdminSettings = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Admin Settings</span>
        </CardTitle>
        <CardDescription>
          API configuration and system settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-green-800">Hyperleap API Key Configured</p>
              <p className="text-sm text-green-700">
                The Hyperleap API key has been successfully configured in Supabase Edge Function Secrets.
                Your campaign message generation is now ready to use.
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Manage API Keys</p>
              <p className="text-blue-600 text-sm mt-1">
                To update or manage your API keys, visit the Supabase Edge Function Secrets in your project dashboard.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
