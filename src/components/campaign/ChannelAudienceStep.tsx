
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { Campaign, SelectOption } from "@/types/campaign";

interface ChannelAudienceStepProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  channels: SelectOption[];
  userTypes: SelectOption[];
}

const ChannelAudienceStep: React.FC<ChannelAudienceStepProps> = ({
  campaign,
  setCampaign,
  channels,
  userTypes
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Channel & Audience</span>
        </CardTitle>
        <CardDescription>
          Choose your messaging channel and target audience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Messaging Channel</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {channels.map((channel) => (
              <div
                key={channel.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  campaign.channel === channel.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCampaign(prev => ({ ...prev, channel: channel.value }))}
              >
                <h4 className="font-semibold text-gray-900">{channel.label}</h4>
                <p className="text-sm text-gray-600">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Target Audience</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userTypes.map((userType) => (
              <div
                key={userType.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  campaign.userType === userType.value
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCampaign(prev => ({ ...prev, userType: userType.value }))}
              >
                <h4 className="font-semibold text-gray-900">{userType.label}</h4>
                <p className="text-sm text-gray-600">{userType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelAudienceStep;
