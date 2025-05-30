
import { SelectOption } from "@/types/campaign";

export const channels: SelectOption[] = [
  { value: 'push', label: 'Push Notification', description: 'In-app notifications' },
  { value: 'sms', label: 'SMS', description: 'Text messages' },
  { value: 'email', label: 'Email', description: 'Email campaigns' },
  { value: 'whatsapp', label: 'WhatsApp', description: 'WhatsApp Business' },
];

export const userTypes: SelectOption[] = [
  { value: 'riders', label: 'Riders', description: 'App users who request rides' },
  { value: 'drivers', label: 'Driver Partners', description: 'Driver-partners on the platform' },
];

export const campaignTypes: SelectOption[] = [
  { value: 'reengagement', label: 'Re-engagement', description: 'Win back inactive users' },
  { value: 'promotions', label: 'Promotions', description: 'Special offers and discounts' },
  { value: 'loyalty', label: 'Loyalty', description: 'Reward frequent users' },
  { value: 'behavioral', label: 'Behavioral Nudges', description: 'Drive specific actions' },
];
