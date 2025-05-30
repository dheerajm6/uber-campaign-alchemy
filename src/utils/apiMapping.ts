
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

  const engagementToBehaviorMap: { [key: string]: string } = {
    'high': 'Highly engaged users who frequently use the app',
    'medium': 'Moderately engaged users with regular usage',
    'low': 'Low engagement users who rarely use the app',
    'inactive': 'Inactive users who haven\'t used the app recently'
  };

  const activityToPatternMap: { [key: string]: string } = {
    '7days': 'Active in the last 7 days',
    '30days': 'Active in the last 30 days',
    '90days': 'Active in the last 90 days',
    'never': 'Never been active'
  };

  return {
    channel_type: channelMap[campaign.channel] || campaign.channel,
    user_type: userTypeMap[campaign.userType] || campaign.userType,
    campaign_goal: campaignGoalMap[campaign.campaignType] || campaign.campaignType,
    user_behavior: engagementToBehaviorMap[campaign.filters.engagement] || 'General users',
    desired_outcome: 'Increase user engagement and drive action',
    brand_tone: 'Professional, friendly, and trustworthy - consistent with Uber\'s brand voice',
    location: campaign.filters.location || 'All locations',
    behavior_pattern: activityToPatternMap[campaign.filters.activity] || 'General activity pattern',
    tone_style: 'Concise, engaging, and action-oriented',
    language: 'English',
    number_of_variants: '1'
  };
};
