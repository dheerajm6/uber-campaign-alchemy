
export interface CampaignFilters {
  engagement: string;
  activity: string;
  location: string;
}

export interface CampaignSettings {
  numberOfVariants: string;
  language: string;
  toneStyle: string;
  brandTone: string;
  desiredOutcome: string;
}

export interface Campaign {
  channel: string;
  userType: string;
  campaignType: string;
  filters: CampaignFilters;
  settings: CampaignSettings;
  generatedMessage: string;
  isGenerating: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  description: string;
}
