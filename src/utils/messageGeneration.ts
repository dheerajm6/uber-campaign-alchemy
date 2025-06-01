
import { supabase } from "@/integrations/supabase/client";
import { mapCampaignToReplacements } from "@/utils/apiMapping";
import { Campaign } from "@/types/campaign";

export const generateCampaignMessage = async (campaign: Campaign): Promise<string> => {
  const replacements = mapCampaignToReplacements(campaign);
  
  console.log('=== USING SUPABASE EDGE FUNCTION ===');
  console.log('Attempting to generate message via Supabase Edge Function...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-message', {
      body: { replacements }
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(error.message || 'Edge Function failed');
    }

    if (data?.message) {
      console.log('Successfully generated message via Edge Function');
      return data.message;
    }

    throw new Error('No message content in Edge Function response');
  } catch (error) {
    console.error('Edge Function call failed:', error);
    
    // Fallback to mock generator
    console.log('Falling back to mock generator...');
    return generateMockMessage(replacements);
  }
};

// Mock generator as fallback
const generateMockMessage = async (replacements: any): Promise<string> => {
  console.log('=== MOCK MESSAGE GENERATION ===');
  console.log('Campaign replacements:', replacements);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a contextual mock message based on the campaign data
  const { channel_type, user_type, campaign_goal, user_behavior, location } = replacements;
  
  let mockMessage = '';
  
  if (campaign_goal === 'Re-engage inactive users') {
    mockMessage = `🚗 We miss you! Come back and enjoy 20% off your next ride in ${location}. Your trusted ${channel_type.toLowerCase()} companion is waiting for you.`;
  } else if (campaign_goal === 'Promote special offers and discounts') {
    mockMessage = `🎉 Exclusive offer for ${user_type.toLowerCase()}! Save big with our limited-time promotion. Book now and experience the convenience you deserve.`;
  } else if (campaign_goal === 'Reward loyal customers') {
    mockMessage = `⭐ Thank you for being a valued ${user_type.toLowerCase().slice(0, -1)}! As a token of our appreciation, here's a special reward just for you.`;
  } else {
    mockMessage = `📱 Time to get moving! Your next ${channel_type.toLowerCase()} experience is just a tap away. Join thousands of satisfied ${user_type.toLowerCase()} today.`;
  }
  
  console.log('Generated mock message:', mockMessage);
  console.log('===============================');
  
  return mockMessage;
};
