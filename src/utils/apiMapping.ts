
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

  const targetAudienceMap: { [key: string]: string } = {
    'new_users': 'New Users',
    'active_users': 'Active Users',
    'lapsed_users': 'Lapsed Users',
    'high_value': 'High Value Users',
    'all_users': 'All Users'
  };

  const campaignBudgetMap: { [key: string]: string } = {
    'low': 'Low Budget ($0-$1000)',
    'medium': 'Medium Budget ($1000-$5000)',
    'high': 'High Budget ($5000-$15000)',
    'premium': 'Premium Budget ($15000+)'
  };

  const desiredOutcomeMap: { [key: string]: string } = {
    'increase_engagement': 'Increase user engagement and drive action',
    'drive_conversions': 'Drive conversions and sales',
    'boost_retention': 'Boost user retention and loyalty',
    'generate_leads': 'Generate qualified leads',
    'increase_awareness': 'Increase brand awareness'
  };

  // Map ALL variables that your Hyperleap API expects
  const replacements = {
    // Core campaign details
    channel_type: channelMap[campaign.channel] || campaign.channel,
    user_type: userTypeMap[campaign.userType] || campaign.userType,
    campaign_goal: campaignGoalMap[campaign.campaignType] || campaign.campaignType,
    
    // User targeting and filters
    user_behavior: engagementMap[campaign.filters.engagement] || campaign.filters.engagement,
    activity_pattern: activityMap[campaign.filters.activity] || campaign.filters.activity,
    location: campaign.filters.location || 'All locations',
    
    // Additional targeting parameters
    target_audience: targetAudienceMap[campaign.targeting.targetAudience] || campaign.targeting.targetAudience,
    campaign_budget: campaignBudgetMap[campaign.targeting.campaignBudget] || campaign.targeting.campaignBudget,
    desired_outcome: desiredOutcomeMap[campaign.targeting.desiredOutcome] || campaign.targeting.desiredOutcome,
    
    // Campaign settings
    number_of_variants: campaign.settings.numberOfVariants || '1',
    language: campaign.settings.language || 'English',
    tone_style: toneStyleMap[campaign.settings.toneStyle] || campaign.settings.toneStyle,
    brand_tone: brandToneMap[campaign.settings.brandTone] || campaign.settings.brandTone,
    
    // Additional targeting flags
    include_inactive: campaign.targeting.includeInactive ? 'Yes' : 'No',
    include_low_spenders: campaign.targeting.includeLowSpenders ? 'Yes' : 'No',
    include_new_users: campaign.targeting.includeNewUsers ? 'Yes' : 'No'
  };

  console.log('=== COMPLETE API MAPPING ===');
  console.log('Campaign data:', campaign);
  console.log('Generated replacements:', replacements);
  console.log('All replacement keys:', Object.keys(replacements));
  console.log('============================');

  return replacements;
};
