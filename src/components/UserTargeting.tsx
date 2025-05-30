
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Users, TrendingDown, Clock, DollarSign } from "lucide-react";

const UserTargeting = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all');

  // Mock user data
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      type: "Rider",
      lastActive: "2 days ago",
      status: "Active",
      engagement: "High",
      totalSpent: "$324",
      campaigns: 5,
      tags: ["Frequent User", "High Value"]
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "m.chen@email.com",
      type: "Driver",
      lastActive: "1 week ago",
      status: "Inactive",
      engagement: "Low",
      totalSpent: "$0",
      campaigns: 12,
      tags: ["Churned", "Re-engagement Target"]
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@email.com",
      type: "Rider",
      lastActive: "5 minutes ago",
      status: "Active",
      engagement: "Medium",
      totalSpent: "$156",
      campaigns: 3,
      tags: ["Regular User", "Promotional"]
    },
    {
      id: 4,
      name: "James Wilson",
      email: "j.wilson@email.com",
      type: "Driver",
      lastActive: "3 days ago",
      status: "Active",
      engagement: "High",
      totalSpent: "$0",
      campaigns: 8,
      tags: ["Top Performer", "Loyalty"]
    },
    {
      id: 5,
      name: "Lisa Park",
      email: "lisa.park@email.com",
      type: "Rider",
      lastActive: "2 weeks ago",
      status: "Inactive",
      engagement: "Low",
      totalSpent: "$89",
      campaigns: 7,
      tags: ["Low Engagement", "Win-back"]
    },
  ];

  const segments = [
    { value: 'all', label: 'All Users', count: users.length },
    { value: 'active', label: 'Active Users', count: users.filter(u => u.status === 'Active').length },
    { value: 'inactive', label: 'Inactive Users', count: users.filter(u => u.status === 'Inactive').length },
    { value: 'high-value', label: 'High Value', count: users.filter(u => u.tags.includes('High Value')).length },
    { value: 'churned', label: 'Churned', count: users.filter(u => u.tags.includes('Churned')).length },
  ];

  const getFilteredUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSegment !== 'all') {
      switch (selectedSegment) {
        case 'active':
          filtered = filtered.filter(u => u.status === 'Active');
          break;
        case 'inactive':
          filtered = filtered.filter(u => u.status === 'Inactive');
          break;
        case 'high-value':
          filtered = filtered.filter(u => u.tags.includes('High Value'));
          break;
        case 'churned':
          filtered = filtered.filter(u => u.tags.includes('Churned'));
          break;
      }
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High':
        return 'bg-blue-100 text-blue-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Targeting</h2>
          <p className="text-gray-600">Manage and segment your user base for targeted campaigns</p>
        </div>
        <Button className="bg-black hover:bg-gray-800 text-white">
          <Users className="w-4 h-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.value} value={segment.value}>
                    {segment.label} ({segment.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: users.length.toLocaleString(), color: 'text-blue-600' },
          { icon: TrendingDown, label: 'Inactive Users', value: users.filter(u => u.status === 'Inactive').length, color: 'text-red-600' },
          { icon: Clock, label: 'Recently Active', value: users.filter(u => u.lastActive.includes('minutes') || u.lastActive.includes('hours')).length, color: 'text-green-600' },
          { icon: DollarSign, label: 'High Value', value: users.filter(u => u.tags.includes('High Value')).length, color: 'text-purple-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {getFilteredUsers().length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredUsers().map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {user.type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </Badge>
                      <Badge className={`text-xs ${getEngagementColor(user.engagement)}`}>
                        {user.engagement}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.totalSpent}</p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.campaigns}</p>
                    <p className="text-xs text-gray-500">Campaigns</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.lastActive}</p>
                    <p className="text-xs text-gray-500">Last Active</p>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {user.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {getFilteredUsers().length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segmentation Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common user segments for campaign targeting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                title: "Win-back Campaign", 
                description: "Target users inactive for 30+ days",
                count: users.filter(u => u.tags.includes('Churned') || u.status === 'Inactive').length,
                color: "border-red-200 bg-red-50"
              },
              { 
                title: "Loyalty Rewards", 
                description: "High-value and frequent users",
                count: users.filter(u => u.tags.includes('High Value') || u.tags.includes('Frequent User')).length,
                color: "border-blue-200 bg-blue-50"
              },
              { 
                title: "New User Onboarding", 
                description: "Users who joined in the last 7 days",
                count: Math.floor(Math.random() * 50) + 25, // Mock new users
                color: "border-green-200 bg-green-50"
              },
            ].map((action, index) => (
              <div key={index} className={`p-4 border-2 rounded-lg ${action.color} cursor-pointer hover:opacity-80 transition-opacity`}>
                <h4 className="font-semibold text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">
                    {action.count} users
                  </Badge>
                  <Button size="sm" variant="outline">
                    Create Campaign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTargeting;
