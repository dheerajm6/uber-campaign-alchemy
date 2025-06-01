
import { supabase } from "@/integrations/supabase/client";
import { mapCampaignToReplacements } from "@/utils/apiMapping";
import { Campaign } from "@/types/campaign";

const HYPERLEAP_API_URL = 'https://api.hyperleap.ai/prompt-runs/run';
const PROMPT_ID = '9ab5aa1f-b408-4881-9355-d82bf23c52dd';
const PROMPT_VERSION_ID = '7c3a9c75-150e-4d92-99de-af31ff065bb9';

export const generateCampaignMessage = async (campaign: Campaign): Promise<string> => {
  const replacements = mapCampaignToReplacements(campaign);
  
  // Check if we have the API key for direct frontend calls
  const apiKey = import.meta.env.VITE_HYPERLEAP_API_KEY;
  
  if (apiKey) {
    console.log('=== USING REAL HYPERLEAP API ===');
    console.log('Attempting direct frontend API call to Hyperleap...');
    
    try {
      return await generateMessageDirectly(replacements, apiKey);
    } catch (error) {
      console.error('Direct Hyperleap API call failed:', error);
      
      // Fallback to Edge Function as backup
      console.log('Trying Edge Function as fallback...');
      try {
        const { data, error: edgeError } = await supabase.functions.invoke('generate-message', {
          body: { replacements }
        });

        if (edgeError) {
          throw new Error(edgeError.message || 'Edge Function failed');
        }

        if (data?.message) {
          return data.message;
        }
      } catch (edgeError) {
        console.error('Edge Function also failed:', edgeError);
      }
      
      // Final fallback to mock
      console.log('Falling back to mock generator...');
      return generateMockMessage(replacements);
    }
  } else {
    console.log('=== NO API KEY - USING MOCK ===');
    console.log('VITE_HYPERLEAP_API_KEY not found, using mock generator...');
    return generateMockMessage(replacements);
  }
};

// Real Hyperleap API call
const generateMessageDirectly = async (replacements: any, apiKey: string): Promise<string> => {
  console.log('Making request to Hyperleap API...');
  console.log('Replacements:', replacements);
  
  const response = await fetch(HYPERLEAP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt_id: PROMPT_ID,
      prompt_version_id: PROMPT_VERSION_ID,
      replacements: replacements,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hyperleap API failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Hyperleap API response:', data);
  
  if (data.output) {
    return data.output;
  }
  
  throw new Error('No message content in Hyperleap API response');
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
