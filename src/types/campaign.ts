
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

export interface Campaign {
  channel: string;
  userType: string;
  campaignType: string;
  filters: CampaignFilters;
  targeting: CampaignTargeting;
  generatedMessage: string;
  isGenerating: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  description: string;
}
