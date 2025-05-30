
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Campaign } from "@/types/campaign";

interface CampaignSummaryProps {
  campaign: Campaign;
  step: number;
}

const CampaignSummary: React.FC<CampaignSummaryProps> = ({ campaign, step }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Campaign Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Channel:</span>
            <Badge variant={campaign.channel ? "default" : "outline"}>
              {campaign.channel || 'Not selected'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Audience:</span>
            <Badge variant={campaign.userType ? "default" : "outline"}>
              {campaign.userType || 'Not selected'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Type:</span>
            <Badge variant={campaign.campaignType ? "default" : "outline"}>
              {campaign.campaignType || 'Not selected'}
            </Badge>
          </div>
        </div>

        {campaign.filters.engagement && (
          <div className="pt-3 border-t">
            <p className="text-sm font-medium text-gray-700 mb-2">Filters:</p>
            <div className="space-y-1">
              {campaign.filters.engagement && (
                <p className="text-xs text-gray-600">• {campaign.filters.engagement} engagement</p>
              )}
              {campaign.filters.activity && (
                <p className="text-xs text-gray-600">• {campaign.filters.activity} activity</p>
              )}
              {campaign.filters.location && (
                <p className="text-xs text-gray-600">• {campaign.filters.location} location</p>
              )}
            </div>
          </div>
        )}

        {step > 1 && (
          <Alert>
            <AlertDescription className="text-xs">
              Estimated reach: <strong>12,500 users</strong><br />
              Expected CTR: <strong>3.2%</strong>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignSummary;
