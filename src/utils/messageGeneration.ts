
import { supabase } from "@/integrations/supabase/client";
import { mapCampaignToReplacements } from "@/utils/apiMapping";
import { Campaign } from "@/types/campaign";

const HYPERLEAP_API_URL = 'https://api.hyperleap.ai/prompt-runs/run';
const PROMPT_ID = '9ab5aa1f-b408-4881-9355-d82bf23c52dd';
const PROMPT_VERSION_ID = '7c3a9c75-150e-4d92-99de-af31ff065bb9';

// Check if we're in development (localhost or lovable.app preview)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.app');

export const generateCampaignMessage = async (campaign: Campaign): Promise<string> => {
  const replacements = mapCampaignToReplacements(campaign);
  
  // First, try the Edge Function approach
  try {
    console.log('Attempting Edge Function approach...');
    const { data, error } = await supabase.functions.invoke('generate-message', {
      body: { replacements }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to generate message via Edge Function');
    }

    if (data?.message) {
      console.log('Edge Function succeeded:', data.message);
      return data.message;
    }
  } catch (error) {
    console.error('Edge Function failed:', error);
    
    // If we're in development, re-throw the original error for debugging
    if (isDevelopment) {
      throw error;
    }
    
    // In production, try direct frontend call as fallback
    console.log('Attempting frontend fallback...');
    try {
      return await generateMessageDirectly(replacements);
    } catch (fallbackError) {
      console.error('Frontend fallback also failed:', fallbackError);
      throw new Error(
        'Message generation is temporarily unavailable. This appears to be a network connectivity issue. Please try again in a few minutes.'
      );
    }
  }
  
  throw new Error('No message generated');
};

// Direct frontend API call as fallback
const generateMessageDirectly = async (replacements: any): Promise<string> => {
  // Note: This requires HYPERLEAP_API_KEY to be set as a public environment variable
  // For now, we'll show a helpful error message
  throw new Error(
    'Direct API fallback is not yet configured. Please contact support to set up the HYPERLEAP_API_KEY environment variable for direct frontend calls.'
  );
};
