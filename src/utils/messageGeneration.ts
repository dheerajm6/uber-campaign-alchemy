
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
  
  const { 
    channel_type, 
    user_type, 
    campaign_goal, 
    user_behavior, 
    location,
    tone_style,
    brand_tone,
    number_of_variants
  } = replacements;

  // Generate multiple variants if requested
  const variantCount = parseInt(number_of_variants) || 1;
  const variants = [];

  for (let i = 0; i < variantCount; i++) {
    let mockMessage = generateSingleVariant(replacements, i);
    variants.push(mockMessage);
  }

  // Return all variants joined with line breaks if multiple
  const finalMessage = variantCount > 1 
    ? variants.map((variant, index) => `Variant ${index + 1}:\n${variant}`).join('\n\n')
    : variants[0];
  
  console.log('Generated mock message(s):', finalMessage);
  console.log('Number of variants generated:', variantCount);
  console.log('===============================');
  
  return finalMessage;
};

const generateSingleVariant = (replacements: any, variantIndex: number): string => {
  const { 
    channel_type, 
    user_type, 
    campaign_goal, 
    user_behavior, 
    location,
    tone_style,
    brand_tone
  } = replacements;

  let baseMessage = '';
  let emoji = '🚗';
  
  // Set emoji based on channel type
  if (channel_type === 'Push Notification') emoji = '📱';
  else if (channel_type === 'SMS') emoji = '💬';
  else if (channel_type === 'Email') emoji = '✉️';
  else if (channel_type === 'WhatsApp') emoji = '💚';

  // Generate base message based on campaign goal
  if (campaign_goal === 'Re-engage inactive users') {
    const messages = [
      `${emoji} We miss you! Come back and enjoy 20% off your next ride in ${location}.`,
      `${emoji} Your favorite ride is waiting! Get back on the road with 25% off in ${location}.`,
      `${emoji} Time to reconnect! Special comeback offer just for you in ${location}.`
    ];
    baseMessage = messages[variantIndex % messages.length];
  } else if (campaign_goal === 'Promote special offers and discounts') {
    const messages = [
      `${emoji} Exclusive offer for ${user_type.toLowerCase()}! Save big with our limited-time promotion.`,
      `${emoji} Special deal alert! Don't miss out on savings just for ${user_type.toLowerCase()}.`,
      `${emoji} Flash sale happening now! Exclusive discounts for our valued ${user_type.toLowerCase()}.`
    ];
    baseMessage = messages[variantIndex % messages.length];
  } else if (campaign_goal === 'Reward loyal customers') {
    const messages = [
      `${emoji} Thank you for being a valued ${user_type.toLowerCase().slice(0, -1)}! Here's a special reward just for you.`,
      `${emoji} Loyalty pays off! Enjoy this exclusive reward as our way of saying thanks.`,
      `${emoji} You're amazing! Here's a special treat for being such a loyal ${user_type.toLowerCase().slice(0, -1)}.`
    ];
    baseMessage = messages[variantIndex % messages.length];
  } else {
    const messages = [
      `${emoji} Time to get moving! Your next ${channel_type.toLowerCase()} experience is just a tap away.`,
      `${emoji} Ready for your next adventure? Join thousands of satisfied ${user_type.toLowerCase()} today.`,
      `${emoji} Your ride awaits! Experience the convenience you deserve.`
    ];
    baseMessage = messages[variantIndex % messages.length];
  }

  // Apply tone style modifications
  if (tone_style === 'Playful and fun tone') {
    baseMessage = baseMessage.replace(/!(?!\s*$)/g, '! 🎉');
    if (!baseMessage.includes('🎉')) baseMessage += ' 🎉';
  } else if (tone_style === 'Urgent and action-oriented tone') {
    baseMessage = baseMessage.toUpperCase().replace(/\./g, '!');
    if (!baseMessage.includes('⚡')) baseMessage = `⚡ ${baseMessage}`;
  } else if (tone_style === 'Professional and formal tone') {
    baseMessage = baseMessage.replace(/!/g, '.');
    baseMessage = baseMessage.replace(/🎉|⚡/g, '');
  }

  // Apply brand tone modifications
  if (brand_tone === 'Trustworthy and reliable brand voice') {
    baseMessage += ' Your trusted partner in transportation.';
  } else if (brand_tone === 'Innovative and modern brand voice') {
    baseMessage += ' Experience the future of mobility today.';
  } else if (brand_tone === 'Premium and sophisticated brand voice') {
    baseMessage += ' Elevate your journey with premium service.';
  } else if (brand_tone === 'Friendly and approachable brand voice') {
    baseMessage += ' We\'re here to make your day better!';
  }

  return baseMessage;
};
