
import { Campaign } from "@/types/campaign";

export const mapCampaignToReplacements = (campaign: Campaign) => {
  const channelMap: { [key: string]: string } = {
    'push': 'Push Notification',
    'sms': 'SMS',
    'email': 'Email',
    'whatsapp': 'WhatsApp'
  };

  const userTypeMap: { [key: string]: string } = {
    'riders': 'Riders',
    'drivers': 'Driver Partners'
  };

  const campaignGoalMap: { [key: string]: string } = {
    'reengagement': 'Re-engage inactive users',
    'promotions': 'Promote special offers and discounts',
    'loyalty': 'Reward loyal customers',
    'behavioral': 'Drive specific user behaviors'
  };

  // Only send variables that are actually collected and likely defined in your prompt
  const replacements: { [key: string]: string } = {};

  // Core required fields
  if (campaign.channel) {
    replacements.channel_type = channelMap[campaign.channel] || campaign.channel;
  }
  
  if (campaign.userType) {
    replacements.user_type = userTypeMap[campaign.userType] || campaign.userType;
  }
  
  if (campaign.campaignType) {
    replacements.campaign_goal = campaignGoalMap[campaign.campaignType] || campaign.campaignType;
  }

  // Optional fields - only add if they have values
  if (campaign.filters.engagement) {
    const engagementMap: { [key: string]: string } = {
      'high': 'Highly engaged users',
      'medium': 'Moderately engaged users',
      'low': 'Low engagement users',
      'inactive': 'Inactive users'
    };
    replacements.user_behavior = engagementMap[campaign.filters.engagement] || campaign.filters.engagement;
  }

  if (campaign.filters.location && campaign.filters.location !== 'all') {
    replacements.location = campaign.filters.location;
  }

  if (campaign.filters.activity) {
    const activityMap: { [key: string]: string } = {
      '7days': 'Active in last 7 days',
      '30days': 'Active in last 30 days',
      '90days': 'Active in last 90 days',
      'never': 'Never active'
    };
    replacements.activity_pattern = activityMap[campaign.filters.activity] || campaign.filters.activity;
  }

  console.log('=== SIMPLIFIED API MAPPING ===');
  console.log('Campaign data:', campaign);
  console.log('Generated replacements:', replacements);
  console.log('Replacement keys:', Object.keys(replacements));
  console.log('==============================');

  return replacements;
};
