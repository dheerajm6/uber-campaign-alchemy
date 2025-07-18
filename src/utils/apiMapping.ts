
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

  const engagementMap: { [key: string]: string } = {
    'high': 'Highly engaged users who frequently use the app',
    'medium': 'Moderately engaged users with regular usage',
    'low': 'Low engagement users who rarely use the app',
    'inactive': 'Inactive users who haven\'t used the app recently'
  };

  const activityMap: { [key: string]: string } = {
    '7days': 'Active in the last 7 days',
    '30days': 'Active in the last 30 days',
    '90days': 'Active in the last 90 days',
    'never': 'Never been active'
  };

  const toneStyleMap: { [key: string]: string } = {
    'casual': 'Casual and friendly tone',
    'professional': 'Professional and formal tone',
    'urgent': 'Urgent and action-oriented tone',
    'playful': 'Playful and fun tone'
  };

  const brandToneMap: { [key: string]: string } = {
    'trustworthy': 'Trustworthy and reliable brand voice',
    'innovative': 'Innovative and modern brand voice',
    'friendly': 'Friendly and approachable brand voice',
    'premium': 'Premium and sophisticated brand voice'
  };

  const desiredOutcomeMap: { [key: string]: string } = {
    'increase_rides': 'Increase ride bookings',
    'improve_retention': 'Improve user retention',
    'boost_engagement': 'Boost app engagement',
    'drive_referrals': 'Drive user referrals'
  };

  // Map only the exact variables that your API accepts
  const replacements = {
    channel_type: channelMap[campaign.channel] || campaign.channel,
    user_type: userTypeMap[campaign.userType] || campaign.userType,
    campaign_goal: campaignGoalMap[campaign.campaignType] || campaign.campaignType,
    user_behavior: engagementMap[campaign.filters.engagement] || campaign.filters.engagement,
    desired_outcome: desiredOutcomeMap[campaign.settings.desiredOutcome] || campaign.settings.desiredOutcome,
    brand_tone: brandToneMap[campaign.settings.brandTone] || campaign.settings.brandTone,
    location: campaign.filters.location || 'All locations',
    behavior_pattern: activityMap[campaign.filters.activity] || campaign.filters.activity,
    tone_style: toneStyleMap[campaign.settings.toneStyle] || campaign.settings.toneStyle,
    language: campaign.settings.language || 'English',
    number_of_variants: campaign.settings.numberOfVariants || '1'
  };

  console.log('=== API MAPPING - EXACT PARAMETERS ===');
  console.log('Campaign data:', campaign);
  console.log('Generated replacements:', replacements);
  console.log('All replacement keys:', Object.keys(replacements));
  console.log('======================================');

  return replacements;
};
