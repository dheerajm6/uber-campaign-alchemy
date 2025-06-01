
import { supabase } from "@/integrations/supabase/client";
import { mapCampaignToReplacements } from "@/utils/apiMapping";
import { Campaign } from "@/types/campaign";

const HYPERLEAP_API_URL = 'https://api.hyperleap.ai/prompt-runs/run';
const PROMPT_ID = '9ab5aa1f-b408-4881-9355-d82bf23c52dd';
const PROMPT_VERSION_ID = '7c3a9c75-150e-4d92-99de-af31ff065bb9';

// This would need to be set as a public environment variable in Netlify
// For now, we'll try Edge Function first, then show instructions if it fails
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable.app');

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
    
    // If we're in production and Edge Function fails, show helpful message
    if (isProduction) {
      throw new Error(
        'Message generation is temporarily unavailable. Please ensure your Hyperleap API key is configured and try again in a few minutes.'
      );
    }
    
    // If we're in development, re-throw the original error
    throw error;
  }
  
  throw new Error('No message generated');
};
