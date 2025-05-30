
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Users, Target, Sparkles, Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CampaignBuilderProps {
  apiKey: string;
}

const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ apiKey }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState({
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

  const channels = [
    { value: 'push', label: 'Push Notification', description: 'In-app notifications' },
    { value: 'sms', label: 'SMS', description: 'Text messages' },
    { value: 'email', label: 'Email', description: 'Email campaigns' },
    { value: 'whatsapp', label: 'WhatsApp', description: 'WhatsApp Business' },
  ];

  const userTypes = [
    { value: 'riders', label: 'Riders', description: 'App users who request rides' },
    { value: 'drivers', label: 'Driver Partners', description: 'Driver-partners on the platform' },
  ];

  const campaignTypes = [
    { value: 'reengagement', label: 'Re-engagement', description: 'Win back inactive users' },
    { value: 'promotions', label: 'Promotions', description: 'Special offers and discounts' },
    { value: 'loyalty', label: 'Loyalty', description: 'Reward frequent users' },
    { value: 'behavioral', label: 'Behavioral Nudges', description: 'Drive specific actions' },
  ];

  const generateMessage = async () => {
    setCampaign(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const prompt = `Generate a ${campaign.channel} message for ${campaign.userType} for a ${campaign.campaignType} campaign. 
      Target audience: ${campaign.filters.engagement || 'general'} engagement level.
      Keep it concise, engaging, and aligned with Uber's brand voice. 
      ${campaign.channel === 'sms' ? 'Keep under 160 characters.' : ''}
      ${campaign.channel === 'push' ? 'Keep under 50 characters for title and 100 for body.' : ''}`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a marketing copywriter for Uber. Write compelling, concise marketing messages that drive action. Be direct, friendly, and use Uber\'s brand voice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      const generatedMessage = data.choices[0]?.message?.content || 'Failed to generate message';
      
      setCampaign(prev => ({ 
        ...prev, 
        generatedMessage: generatedMessage.trim(),
        isGenerating: false 
      }));

      toast({
        title: "Message Generated",
        description: "Your AI-powered campaign message is ready!",
      });

    } catch (error) {
      console.error('Error generating message:', error);
      setCampaign(prev => ({ ...prev, isGenerating: false }));
      toast({
        title: "Generation Failed",
        description: "Failed to generate message. Please try again.",
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
        return campaign.generatedMessage;
      default:
        return true;
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
          {step === 1 && (
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
          )}

          {step === 2 && (
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
          )}

          {step === 3 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Targeting & Filters</span>
                </CardTitle>
                <CardDescription>
                  Refine your audience with specific filters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Engagement Level</Label>
                    <Select
                      value={campaign.filters.engagement}
                      onValueChange={(value) =>
                        setCampaign(prev => ({
                          ...prev,
                          filters: { ...prev.filters, engagement: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Engagement</SelectItem>
                        <SelectItem value="medium">Medium Engagement</SelectItem>
                        <SelectItem value="low">Low Engagement</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Activity Period</Label>
                    <Select
                      value={campaign.filters.activity}
                      onValueChange={(value) =>
                        setCampaign(prev => ({
                          ...prev,
                          filters: { ...prev.filters, activity: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="never">Never active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select
                      value={campaign.filters.location}
                      onValueChange={(value) =>
                        setCampaign(prev => ({
                          ...prev,
                          filters: { ...prev.filters, location: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="urban">Urban Areas</SelectItem>
                        <SelectItem value="suburban">Suburban Areas</SelectItem>
                        <SelectItem value="specific">Specific Cities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Additional Targeting Options</Label>
                  <div className="space-y-3">
                    {[
                      { key: 'includeInactive', label: 'Include inactive users (90+ days)', description: 'Users who haven\'t opened the app recently' },
                      { key: 'includeLowSpenders', label: 'Include low-value users', description: 'Users with minimal spending history' },
                      { key: 'includeNewUsers', label: 'Include new users', description: 'Users who signed up in the last 30 days' },
                    ].map((option) => (
                      <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{option.label}</p>
                          <p className="text-xs text-gray-600">{option.description}</p>
                        </div>
                        <Switch
                          checked={campaign.targeting[option.key as keyof typeof campaign.targeting]}
                          onCheckedChange={(checked) =>
                            setCampaign(prev => ({
                              ...prev,
                              targeting: { ...prev.targeting, [option.key]: checked }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Message Generation</span>
                </CardTitle>
                <CardDescription>
                  Generate and customize your campaign message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!campaign.generatedMessage ? (
                  <div className="text-center py-8">
                    <Button
                      onClick={generateMessage}
                      disabled={campaign.isGenerating}
                      className="bg-black hover:bg-gray-800 text-white px-8 py-3"
                    >
                      {campaign.isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate AI Message
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      AI will create a personalized message based on your campaign settings
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Label className="text-sm font-medium text-gray-700">Generated Message</Label>
                      <Textarea
                        value={campaign.generatedMessage}
                        onChange={(e) =>
                          setCampaign(prev => ({ ...prev, generatedMessage: e.target.value }))
                        }
                        className="mt-2 min-h-[100px] resize-none border-0 bg-white"
                        placeholder="Your AI-generated message will appear here..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={generateMessage}
                        disabled={campaign.isGenerating}
                        className="flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button
                        onClick={launchCampaign}
                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Launch Campaign
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Campaign Summary */}
        <div className="space-y-6">
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
