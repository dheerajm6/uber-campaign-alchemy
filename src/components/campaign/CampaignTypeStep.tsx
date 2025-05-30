
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Campaign, SelectOption } from "@/types/campaign";

interface CampaignTypeStepProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  campaignTypes: SelectOption[];
}

const CampaignTypeStep: React.FC<CampaignTypeStepProps> = ({
  campaign,
  setCampaign,
  campaignTypes
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Campaign Type</span>
        </CardTitle>
        <CardDescription>
          Select the type of campaign you want to run
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaignTypes.map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                campaign.campaignType === type.value
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCampaign(prev => ({ ...prev, campaignType: type.value }))}
            >
              <h4 className="font-semibold text-gray-900">{type.label}</h4>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTypeStep;
