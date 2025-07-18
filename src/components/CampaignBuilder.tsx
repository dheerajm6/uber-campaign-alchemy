import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types/campaign";
import { channels, userTypes, campaignTypes } from "@/utils/campaignData";
import { generateCampaignMessage } from "@/utils/messageGeneration";
import { createCampaign } from "@/services/database";
import { useCampaignContext } from "@/contexts/CampaignContext";
import ChannelAudienceStep from "@/components/campaign/ChannelAudienceStep";
import CampaignTypeStep from "@/components/campaign/CampaignTypeStep";
import TargetingStep from "@/components/campaign/TargetingStep";
import MessageGenerationStep from "@/components/campaign/MessageGenerationStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";

const CampaignBuilder: React.FC = () => {
  const { toast } = useToast();
  const { selectedUsers, selectedSegment, clearSelection } = useCampaignContext();
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
    settings: {
      numberOfVariants: '1',
      language: 'English',
      toneStyle: '',
      brandTone: '',
      desiredOutcome: '',
    },
    generatedMessage: '',
    isGenerating: false,
  });

  // Save campaign progress to localStorage
  useEffect(() => {
    if (campaign.channel || campaign.userType || campaign.campaignType) {
      localStorage.setItem('campaign-draft', JSON.stringify({ campaign, step }));
    }
  }, [campaign, step]);

  // Load campaign progress from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('campaign-draft');
    if (savedDraft) {
      try {
        const { campaign: savedCampaign, step: savedStep } = JSON.parse(savedDraft);
        setCampaign(savedCampaign);
        setStep(savedStep);
      } catch (error) {
        console.error('Error loading campaign draft:', error);
      }
    }
  }, []);

  const generateMessage = async () => {
    setCampaign(prev => ({ ...prev, isGenerating: true }));
    
    try {
      console.log('=== GENERATING MESSAGE ===');
      console.log('Campaign data:', campaign);
      
      const message = await generateCampaignMessage(campaign);
      
      setCampaign(prev => ({ 
        ...prev, 
        generatedMessage: message,
        isGenerating: false 
      }));

      toast({
        title: "Message Generated",
        description: "Your AI-powered campaign message is ready!",
      });

      console.log('=== SUCCESS ===');
      console.log('Generated message:', message);
      console.log('===============');

    } catch (error) {
      console.error('=== ERROR GENERATING MESSAGE ===');
      console.error('Error details:', error);
      console.error('================================');
      
      setCampaign(prev => ({ ...prev, isGenerating: false }));
      
      const errorMessage = error instanceof Error ? error.message : "Failed to generate message. Please try again.";
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const launchCampaign = async () => {
    try {
      // Create campaign in database
      const campaignData = {
        channel: campaign.channel as 'push' | 'sms' | 'email' | 'whatsapp',
        user_type: campaign.userType as 'riders' | 'drivers',
        campaign_type: campaign.campaignType as 'reengagement' | 'promotions' | 'loyalty' | 'behavioral',
        engagement_filter: campaign.filters.engagement,
        activity_filter: campaign.filters.activity,
        location_filter: campaign.filters.location,
        number_of_variants: parseInt(campaign.settings.numberOfVariants),
        language: campaign.settings.language,
        tone_style: campaign.settings.toneStyle,
        brand_tone: campaign.settings.brandTone,
        desired_outcome: campaign.settings.desiredOutcome,
        generated_message: campaign.generatedMessage,
        status: 'active' as const,
        estimated_reach: selectedUsers.length || Math.floor(Math.random() * 10000) + 1000,
        actual_reach: 0,
        click_through_rate: 0,
        launched_at: new Date().toISOString(),
      };

      const savedCampaign = await createCampaign(campaignData);

      toast({
        title: "Campaign Launched Successfully!",
        description: `${campaign.campaignType} campaign sent via ${campaign.channel} to ${selectedUsers.length || 'estimated'} users`,
      });
      
      // Clear draft, selection, and reset form
      localStorage.removeItem('campaign-draft');
      clearSelection();
      setCampaign({
        channel: '',
        userType: '',
        campaignType: '',
        filters: { engagement: '', activity: '', location: '' },
        settings: { numberOfVariants: '1', language: 'English', toneStyle: '', brandTone: '', desiredOutcome: '' },
        generatedMessage: '',
        isGenerating: false,
      });
      setStep(1);
    } catch (error) {
      console.error('Error launching campaign:', error);
      toast({
        title: "Launch Failed",
        description: "Failed to launch campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canProceedToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 2:
        return campaign.channel && campaign.userType;
      case 3:
        return campaign.campaignType;
      case 4:
        return campaign.channel && campaign.userType && campaign.campaignType && 
               campaign.filters.engagement && campaign.filters.activity && campaign.filters.location;
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
