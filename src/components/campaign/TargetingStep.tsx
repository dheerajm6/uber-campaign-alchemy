
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Users, Settings } from "lucide-react";
import { Campaign } from "@/types/campaign";

interface TargetingStepProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
}

const TargetingStep: React.FC<TargetingStepProps> = ({ campaign, setCampaign }) => {
  const targetingOptions = [
    { key: 'includeInactive', label: 'Include inactive users (90+ days)', description: 'Users who haven\'t opened the app recently' },
    { key: 'includeLowSpenders', label: 'Include low-value users', description: 'Users with minimal spending history' },
    { key: 'includeNewUsers', label: 'Include new users', description: 'Users who signed up in the last 30 days' },
  ];

  return (
    <div className="space-y-6">
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
              {targetingOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                  <Switch
                    checked={campaign.targeting[option.key as keyof typeof campaign.targeting] as boolean}
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

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Campaign Settings</span>
          </CardTitle>
          <CardDescription>
            Configure message generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Number of Variants</Label>
              <Select
                value={campaign.settings.numberOfVariants}
                onValueChange={(value) =>
                  setCampaign(prev => ({
                    ...prev,
                    settings: { ...prev.settings, numberOfVariants: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Variant</SelectItem>
                  <SelectItem value="2">2 Variants</SelectItem>
                  <SelectItem value="3">3 Variants</SelectItem>
                  <SelectItem value="5">5 Variants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={campaign.settings.language}
                onValueChange={(value) =>
                  setCampaign(prev => ({
                    ...prev,
                    settings: { ...prev.settings, language: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone Style</Label>
              <Select
                value={campaign.settings.toneStyle}
                onValueChange={(value) =>
                  setCampaign(prev => ({
                    ...prev,
                    settings: { ...prev.settings, toneStyle: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="urgent">Urgent & Action-oriented</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Brand Tone</Label>
              <Select
                value={campaign.settings.brandTone}
                onValueChange={(value) =>
                  setCampaign(prev => ({
                    ...prev,
                    settings: { ...prev.settings, brandTone: value }
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                  <SelectItem value="innovative">Innovative & Modern</SelectItem>
                  <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                  <SelectItem value="premium">Premium & Sophisticated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TargetingStep;
