import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type Campaign = Tables['campaigns']['Row'];
type UserSegment = Tables['user_segments']['Row'];
type CampaignAnalytics = Tables['campaign_analytics']['Row'];

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const getUsersBySegment = async (filters: any) => {
  let query = supabase.from('users').select('*');
  
  if (filters.user_type) {
    query = query.eq('user_type', filters.user_type);
  }
  
  if (filters.engagement_level) {
    if (Array.isArray(filters.engagement_level)) {
      query = query.in('engagement_level', filters.engagement_level);
    } else {
      query = query.eq('engagement_level', filters.engagement_level);
    }
  }
  
  if (filters.activity_pattern) {
    if (Array.isArray(filters.activity_pattern)) {
      query = query.in('activity_pattern', filters.activity_pattern);
    } else {
      query = query.eq('activity_pattern', filters.activity_pattern);
    }
  }
  
  if (filters.location && filters.location !== 'All locations') {
    query = query.eq('location', filters.location);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Campaign functions
export const getCampaigns = async () => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getCampaignById = async (id: string) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCampaign = async (campaign: Tables['campaigns']['Insert']) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCampaign = async (id: string, campaign: Tables['campaigns']['Update']) => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(campaign)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// User segments functions
export const getUserSegments = async () => {
  const { data, error } = await supabase
    .from('user_segments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createUserSegment = async (segment: Tables['user_segments']['Insert']) => {
  const { data, error } = await supabase
    .from('user_segments')
    .insert(segment)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Analytics functions
export const getCampaignAnalytics = async (campaignId?: string) => {
  let query = supabase.from('campaign_analytics').select('*');
  
  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getDashboardAnalytics = async () => {
  try {
    // Get campaigns with analytics
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (campaignsError) throw campaignsError;
    
    // Get analytics data
    const { data: analytics, error: analyticsError } = await supabase
      .from('campaign_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    
    if (analyticsError) throw analyticsError;
    
    // Get user counts
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('engagement_level, user_type, activity_pattern')
      .order('created_at', { ascending: false });
    
    if (usersError) throw usersError;
    
    return {
      campaigns: campaigns || [],
      analytics: analytics || [],
      users: users || []
    };
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    throw error;
  }
};

// Initialize sample data (for development)
export const initializeSampleData = async () => {
  try {
    // Check if data already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Sample data already exists');
      return;
    }
    
    // Insert sample users
    const sampleUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'admin@uber.com',
        username: 'admin',
        role: 'admin' as const,
        user_type: 'riders' as const,
        engagement_level: 'high' as const,
        activity_pattern: '7days' as const,
        location: 'San Francisco'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'user@uber.com',
        username: 'user',
        role: 'user' as const,
        user_type: 'riders' as const,
        engagement_level: 'medium' as const,
        activity_pattern: '30days' as const,
        location: 'New York'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'sarah.driver@uber.com',
        username: 'sarah_driver',
        role: 'user' as const,
        user_type: 'drivers' as const,
        engagement_level: 'high' as const,
        activity_pattern: '7days' as const,
        location: 'Los Angeles'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'mike.rider@uber.com',
        username: 'mike_rider',
        role: 'user' as const,
        user_type: 'riders' as const,
        engagement_level: 'low' as const,
        activity_pattern: '90days' as const,
        location: 'Chicago'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'lisa.driver@uber.com',
        username: 'lisa_driver',
        role: 'user' as const,
        user_type: 'drivers' as const,
        engagement_level: 'medium' as const,
        activity_pattern: '30days' as const,
        location: 'Miami'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        email: 'john.inactive@uber.com',
        username: 'john_inactive',
        role: 'user' as const,
        user_type: 'riders' as const,
        engagement_level: 'inactive' as const,
        activity_pattern: 'never' as const,
        location: 'Seattle'
      }
    ];
    
    const { error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers);
    
    if (usersError) throw usersError;
    
    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};