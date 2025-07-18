-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    user_type TEXT DEFAULT 'riders' CHECK (user_type IN ('riders', 'drivers')),
    engagement_level TEXT DEFAULT 'medium' CHECK (engagement_level IN ('high', 'medium', 'low', 'inactive')),
    activity_pattern TEXT DEFAULT '7days' CHECK (activity_pattern IN ('7days', '30days', '90days', 'never')),
    location TEXT DEFAULT 'All locations',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES public.users(id),
    channel TEXT NOT NULL CHECK (channel IN ('push', 'sms', 'email', 'whatsapp')),
    user_type TEXT NOT NULL CHECK (user_type IN ('riders', 'drivers')),
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('reengagement', 'promotions', 'loyalty', 'behavioral')),
    
    -- Filters
    engagement_filter TEXT,
    activity_filter TEXT,
    location_filter TEXT,
    
    -- Settings
    number_of_variants INTEGER DEFAULT 1,
    language TEXT DEFAULT 'English',
    tone_style TEXT,
    brand_tone TEXT,
    desired_outcome TEXT,
    
    -- Generated content
    generated_message TEXT,
    
    -- Campaign metadata
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    estimated_reach INTEGER DEFAULT 0,
    actual_reach INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    launched_at TIMESTAMP WITH TIME ZONE
);

-- Create user_segments table for targeting
CREATE TABLE IF NOT EXISTS public.user_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    filters JSONB NOT NULL,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_analytics table
CREATE TABLE IF NOT EXISTS public.campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id),
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create policies for campaigns table
CREATE POLICY "Users can view all campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Users can create campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (created_by = auth.uid());

-- Create policies for user_segments table
CREATE POLICY "Users can view all segments" ON public.user_segments FOR SELECT USING (true);
CREATE POLICY "Users can create segments" ON public.user_segments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own segments" ON public.user_segments FOR UPDATE USING (created_by = auth.uid());

-- Create policies for campaign_analytics table
CREATE POLICY "Users can view all analytics" ON public.campaign_analytics FOR SELECT USING (true);
CREATE POLICY "System can insert analytics" ON public.campaign_analytics FOR INSERT WITH CHECK (true);

-- Insert sample users
INSERT INTO public.users (id, email, username, role, user_type, engagement_level, activity_pattern, location) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@example.com', 'admin', 'admin', 'drivers', 'high', '7days', 'San Francisco'),
    ('550e8400-e29b-41d4-a716-446655440001', 'user@uber.com', 'user', 'user', 'riders', 'medium', '30days', 'New York'),
    ('550e8400-e29b-41d4-a716-446655440002', 'sarah.driver@uber.com', 'sarah_driver', 'user', 'drivers', 'high', '7days', 'Los Angeles'),
    ('550e8400-e29b-41d4-a716-446655440003', 'mike.rider@uber.com', 'mike_rider', 'user', 'riders', 'low', '90days', 'Chicago'),
    ('550e8400-e29b-41d4-a716-446655440004', 'lisa.driver@uber.com', 'lisa_driver', 'user', 'drivers', 'medium', '30days', 'Miami'),
    ('550e8400-e29b-41d4-a716-446655440005', 'john.inactive@uber.com', 'john_inactive', 'user', 'riders', 'inactive', 'never', 'Seattle');

-- Insert sample user segments
INSERT INTO public.user_segments (name, description, filters, created_by) VALUES
    ('Highly Engaged Riders', 'Riders with high engagement in the last 7 days', '{"user_type": "riders", "engagement_level": "high", "activity_pattern": "7days"}', '550e8400-e29b-41d4-a716-446655440000'),
    ('Inactive Users', 'Users who haven''t been active recently', '{"engagement_level": "inactive", "activity_pattern": "never"}', '550e8400-e29b-41d4-a716-446655440000'),
    ('Active Drivers', 'Drivers with regular activity', '{"user_type": "drivers", "engagement_level": ["high", "medium"], "activity_pattern": ["7days", "30days"]}', '550e8400-e29b-41d4-a716-446655440000'),
    ('SF Bay Area Users', 'Users in San Francisco Bay Area', '{"location": "San Francisco"}', '550e8400-e29b-41d4-a716-446655440000');

-- Insert sample campaigns
INSERT INTO public.campaigns (created_by, channel, user_type, campaign_type, engagement_filter, activity_filter, location_filter, number_of_variants, language, tone_style, brand_tone, desired_outcome, generated_message, status, estimated_reach, actual_reach, click_through_rate, launched_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'push', 'riders', 'reengagement', 'inactive', 'never', 'All locations', 1, 'English', 'urgent', 'friendly', 'increase_rides', 'We miss you! Come back and enjoy 20% off your next ride.', 'completed', 5000, 4832, 3.2, NOW() - INTERVAL '7 days'),
    ('550e8400-e29b-41d4-a716-446655440000', 'email', 'drivers', 'promotions', 'high', '7days', 'San Francisco', 2, 'English', 'professional', 'trustworthy', 'boost_engagement', 'Exclusive driver incentives are now available in your area.', 'active', 2000, 1950, 4.5, NOW() - INTERVAL '3 days'),
    ('550e8400-e29b-41d4-a716-446655440001', 'sms', 'riders', 'loyalty', 'medium', '30days', 'New York', 1, 'English', 'friendly', 'premium', 'improve_retention', 'Thank you for being a loyal rider! Here''s a special reward.', 'active', 3000, 2890, 2.8, NOW() - INTERVAL '1 day');

-- Insert sample analytics
INSERT INTO public.campaign_analytics (campaign_id, date, impressions, clicks, conversions, click_through_rate, conversion_rate) 
SELECT 
    c.id,
    (NOW() - INTERVAL '7 days')::DATE + (s.day || ' days')::INTERVAL,
    (random() * 1000 + 500)::INTEGER,
    (random() * 50 + 10)::INTEGER,
    (random() * 10 + 2)::INTEGER,
    (random() * 5 + 1)::DECIMAL(5,2),
    (random() * 2 + 0.5)::DECIMAL(5,2)
FROM public.campaigns c
CROSS JOIN generate_series(0, 6) s(day)
WHERE c.status = 'completed' OR c.status = 'active';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_engagement ON public.users(engagement_level, activity_pattern);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON public.campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_date ON public.campaign_analytics(date);