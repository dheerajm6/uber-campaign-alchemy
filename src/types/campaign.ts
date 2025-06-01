
export interface CampaignFilters {
  engagement: string;
  activity: string;
  location: string;
}

export interface CampaignTargeting {
  includeInactive: boolean;
  includeLowSpenders: boolean;
  includeNewUsers: boolean;
}

export interface CampaignSettings {
  numberOfVariants: string;
  language: string;
  toneStyle: string;
  brandTone: string;
}

export interface Campaign {
  channel: string;
  userType: string;
  campaignType: string;
  filters: CampaignFilters;
  targeting: CampaignTargeting;
  settings: CampaignSettings;
  generatedMessage: string;
  isGenerating: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  description: string;
}
