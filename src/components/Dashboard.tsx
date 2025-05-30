
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, MessageSquare, Mail, Phone } from "lucide-react";

const Dashboard = () => {
  // Mock data for charts
  const campaignData = [
    { channel: 'Push', riders: 12500, drivers: 8200 },
    { channel: 'SMS', riders: 9800, drivers: 6500 },
    { channel: 'Email', riders: 15200, drivers: 4200 },
    { channel: 'WhatsApp', riders: 7500, drivers: 3800 },
  ];

  const engagementData = [
    { name: 'Re-engagement', value: 35, color: '#000000' },
    { name: 'Promotions', value: 25, color: '#404040' },
    { name: 'Loyalty', value: 20, color: '#666666' },
    { name: 'Behavioral', value: 20, color: '#999999' },
  ];

  const weeklyData = [
    { day: 'Mon', campaigns: 24, engagement: 68 },
    { day: 'Tue', campaigns: 31, engagement: 72 },
    { day: 'Wed', campaigns: 28, engagement: 65 },
    { day: 'Thu', campaigns: 35, engagement: 78 },
    { day: 'Fri', campaigns: 42, engagement: 82 },
    { day: 'Sat', campaigns: 18, engagement: 59 },
    { day: 'Sun', campaigns: 22, engagement: 64 },
  ];

  const kpiCards = [
    {
      title: "Total Campaigns",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      description: "This week"
    },
    {
      title: "Active Users Reached",
      value: "89.2K",
      change: "+8.1%",
      trend: "up",
      icon: Users,
      description: "Last 7 days"
    },
    {
      title: "Avg. CTR",
      value: "3.24%",
      change: "-0.8%",
      trend: "down",
      icon: TrendingUp,
      description: "Across all channels"
    },
    {
      title: "Reactivation Rate",
      value: "18.7%",
      change: "+2.3%",
      trend: "up",
      icon: TrendingUp,
      description: "30-day inactive users"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={kpi.trend === 'up' ? 'default' : 'destructive'}
                      className={`${kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs`}
                    >
                      {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {kpi.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{kpi.description}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <kpi.icon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Distribution by Channel */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Campaigns by Channel</CardTitle>
            <CardDescription>Rider vs Driver targeting breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="channel" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="riders" fill="#000000" name="Riders" radius={[2, 2, 0, 0]} />
                <Bar dataKey="drivers" fill="#666666" name="Drivers" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Campaign Types</CardTitle>
            <CardDescription>Distribution across campaign categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Weekly Performance</CardTitle>
          <CardDescription>Campaign volume and engagement trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="campaigns" 
                stroke="#000000" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Campaigns Sent"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#666666" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Engagement Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Campaigns</CardTitle>
          <CardDescription>Latest campaign performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Driver Earnings Boost", type: "Promotions", channel: "Push", status: "Active", ctr: "4.2%", reach: "12.5K" },
              { name: "Rider Comeback Special", type: "Re-engagement", channel: "Email", status: "Completed", ctr: "3.8%", reach: "8.9K" },
              { name: "Weekend Loyalty Rewards", type: "Loyalty", channel: "SMS", status: "Active", ctr: "5.1%", reach: "15.2K" },
              { name: "Peak Hour Incentive", type: "Behavioral", channel: "WhatsApp", status: "Scheduled", ctr: "-", reach: "6.8K" },
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    {campaign.channel === 'Push' && <MessageSquare className="w-5 h-5" />}
                    {campaign.channel === 'Email' && <Mail className="w-5 h-5" />}
                    {campaign.channel === 'SMS' && <Phone className="w-5 h-5" />}
                    {campaign.channel === 'WhatsApp' && <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-600">{campaign.type} • {campaign.channel}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{campaign.reach}</p>
                    <p className="text-xs text-gray-500">Reach</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{campaign.ctr}</p>
                    <p className="text-xs text-gray-500">CTR</p>
                  </div>
                  <Badge 
                    variant={campaign.status === 'Active' ? 'default' : 
                           campaign.status === 'Completed' ? 'secondary' : 'outline'}
                    className={`${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                               campaign.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
                               'bg-yellow-100 text-yellow-800'}`}
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
