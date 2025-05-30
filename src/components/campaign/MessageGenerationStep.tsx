
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Send, RefreshCw } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface MessageGenerationStepProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  onGenerateMessage: () => void;
  onLaunchCampaign: () => void;
}

const MessageGenerationStep: React.FC<MessageGenerationStepProps> = ({
  campaign,
  setCampaign,
  onGenerateMessage,
  onLaunchCampaign
}) => {
  return (
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
              onClick={onGenerateMessage}
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
                onClick={onGenerateMessage}
                disabled={campaign.isGenerating}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={onLaunchCampaign}
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
  );
};

export default MessageGenerationStep;
