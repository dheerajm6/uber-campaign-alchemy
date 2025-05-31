import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types/campaign";
import { channels, userTypes, campaignTypes } from "@/utils/campaignData";
import { mapCampaignToReplacements } from "@/utils/apiMapping";
import ChannelAudienceStep from "@/components/campaign/ChannelAudienceStep";
import CampaignTypeStep from "@/components/campaign/CampaignTypeStep";
import TargetingStep from "@/components/campaign/TargetingStep";
import MessageGenerationStep from "@/components/campaign/MessageGenerationStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";

interface CampaignBuilderProps {
  apiKey: string;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ apiKey }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState<Campaign>({
    channel: '',
    userType: '',
    campaignType: '',
    filters: {
      engagement: '',
      activity: '',
      location: '',
    },
    targeting: {
      includeInactive: false,
      includeLowSpenders: false,
      includeNewUsers: false,
    },
    generatedMessage: '',
    isGenerating: false,
  });

  const generateMessage = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please contact the administrator to configure the Hyperleap API key.",
        variant: "destructive",
      });
      return;
    }

    setCampaign(prev => ({ ...prev, isGenerating: true }));
    
    try {
      console.log('=== HYPERLEAP API CALL DEBUG ===');
      console.log('API Key available:', !!apiKey);
      console.log('API Key length:', apiKey.length);
      console.log('API Key prefix:', apiKey.substring(0, 10) + '...');
      
      const replacements = mapCampaignToReplacements(campaign);

      const requestBody = {
        promptId: '9ab5aa1f-b408-4881-9355-d82bf23c52dd',
        promptVersionId: '7c3a9c75-150e-4d92-99de-af31ff065bb9',
        replacements: replacements
      };

      console.log('Full request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('https://api.hyperleap.ai/prompt-runs/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hl-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        console.error('API Error Response:', responseText);
        throw new Error(`API request failed: ${response.status} - ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from API');
      }
      
      // Try multiple possible response fields
      const generatedMessage = data.output || data.result || data.message || data.text || data.content || data.response;
      
      if (!generatedMessage) {
        console.error('No message found in response. Full response:', data);
        throw new Error('No generated message found in API response');
      }
      
      setCampaign(prev => ({ 
        ...prev, 
        generatedMessage: String(generatedMessage).trim(),
        isGenerating: false 
      }));

      toast({
        title: "Message Generated",
        description: "Your AI-powered campaign message is ready!",
      });

      console.log('=== SUCCESS ===');
      console.log('Generated message:', generatedMessage);
      console.log('===============');

    } catch (error) {
      console.error('=== ERROR GENERATING MESSAGE ===');
      console.error('Error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('================================');
      
      setCampaign(prev => ({ ...prev, isGenerating: false }));
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate message. Please check your API key and try again.",
        variant: "destructive",
      });
    }
  };

  const launchCampaign = () => {
    toast({
      title: "Campaign Launched!",
      description: `${campaign.campaignType} campaign sent via ${campaign.channel} to ${campaign.userType}`,
    });
    
    // Reset form
    setCampaign({
      channel: '',
      userType: '',
      campaignType: '',
      filters: { engagement: '', activity: '', location: '' },
      targeting: { includeInactive: false, includeLowSpenders: false, includeNewUsers: false },
      generatedMessage: '',
      isGenerating: false,
    });
    setStep(1);
  };

  const canProceedToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 2:
        return campaign.channel && campaign.userType;
      case 3:
        return campaign.campaignType;
      case 4:
        return campaign.channel && campaign.userType && campaign.campaignType;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ChannelAudienceStep
            campaign={campaign}
            setCampaign={setCampaign}
            channels={channels}
            userTypes={userTypes}
          />
        );
      case 2:
        return (
          <CampaignTypeStep
            campaign={campaign}
            setCampaign={setCampaign}
            campaignTypes={campaignTypes}
          />
        );
      case 3:
        return (
          <TargetingStep
            campaign={campaign}
            setCampaign={setCampaign}
          />
        );
      case 4:
        return (
          <MessageGenerationStep
            campaign={campaign}
            setCampaign={setCampaign}
            onGenerateMessage={generateMessage}
            onLaunchCampaign={launchCampaign}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Campaign Builder</h2>
            <Badge variant="outline" className="text-sm">
              Step {step} of 4
            </Badge>
          </div>
          <Progress value={(step / 4) * 100} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Setup</span>
            <span>Campaign Type</span>
            <span>Targeting</span>
            <span>Launch</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {renderStepContent()}
        </div>

        {/* Sidebar - Campaign Summary */}
        <div className="space-y-6">
          <CampaignSummary campaign={campaign} step={step} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setStep(Math.min(4, step + 1))}
          disabled={step === 4 || !canProceedToStep(step + 1)}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {step === 4 ? 'Complete' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default CampaignBuilder;
