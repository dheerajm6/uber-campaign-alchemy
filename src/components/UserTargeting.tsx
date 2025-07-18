import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Users, TrendingDown, Clock, DollarSign, Target, MessageSquare } from "lucide-react";
import { getUsers, getUserSegments, getUsersBySegment, initializeSampleData } from '@/services/database';
import { useCampaignContext } from '@/contexts/CampaignContext';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type User = Tables['users']['Row'];
type UserSegment = Tables['user_segments']['Row'];

const UserTargeting = () => {
  const { toast } = useToast();
  const { selectedUsers, setSelectedUsers, selectedSegment, setSelectedSegment } = useCampaignContext();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [segments, setSegments] = useState<UserSegment[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [engagementFilter, setEngagementFilter] = useState('all');
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize sample data if needed
      await initializeSampleData();
      
      // Load users and segments
      const [usersData, segmentsData] = await Promise.all([
        getUsers(),
        getUserSegments()
      ]);
      
      setUsers(usersData);
      setSegments(segmentsData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load users and segments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSegmentSelection = async (segment: UserSegment) => {
    try {
      setActiveSegmentId(segment.id);
      const segmentUsers = await getUsersBySegment(segment.filters);
      setSelectedUsers(segmentUsers);
      setSelectedSegment(segment);
      setFilteredUsers(segmentUsers);
      
      toast({
        title: "Segment Selected",
        description: `Selected ${segmentUsers.length} users from "${segment.name}" segment`,
      });
    } catch (error) {
      console.error('Error loading segment users:', error);
      toast({
        title: "Error",
        description: "Failed to load segment users",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterUsers(query, engagementFilter);
  };

  const handleEngagementFilter = (filter: string) => {
    setEngagementFilter(filter);
    filterUsers(searchQuery, filter);
  };

  const filterUsers = (query: string, engagement: string) => {
    let filtered = users;
    
    if (query) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (engagement !== 'all') {
      filtered = filtered.filter(user => user.engagement_level === engagement);
    }
    
    setFilteredUsers(filtered);
  };

  const getBadgeColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    return userType === 'drivers' ? '🚗' : '👤';
  };

  const UserList = ({ users, isLoading, emptyMessage = "No users found matching your criteria" }: {
    users: User[];
    isLoading: boolean;
    emptyMessage?: string;
  }) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
              {getUserTypeIcon(user.user_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{user.username}</h3>
                <Badge variant="outline" className="text-xs">
                  {user.user_type}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">{user.location} • Last active: {user.activity_pattern}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`text-xs ${getBadgeColor(user.engagement_level)}`}>
                {user.engagement_level}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const quickActions = [
    {
      title: "Re-engage Inactive Users",
      description: "Target users who haven't been active recently",
      icon: Clock,
      color: "bg-red-50 border-red-200",
      users: users.filter(u => u.engagement_level === 'inactive').length,
      action: () => handleSegmentSelection({
        id: 'inactive',
        name: 'Inactive Users',
        description: 'Users who haven\'t been active recently',
        filters: { engagement_level: 'inactive' },
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    },
    {
      title: "High-Value Drivers",
      description: "Target highly engaged driver partners",
      icon: DollarSign,
      color: "bg-green-50 border-green-200",
      users: users.filter(u => u.user_type === 'drivers' && u.engagement_level === 'high').length,
      action: () => handleSegmentSelection({
        id: 'high-value-drivers',
        name: 'High-Value Drivers',
        description: 'Highly engaged driver partners',
        filters: { user_type: 'drivers', engagement_level: 'high' },
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    },
    {
      title: "Active Riders",
      description: "Regular riders with consistent usage",
      icon: Users,
      color: "bg-blue-50 border-blue-200",
      users: users.filter(u => u.user_type === 'riders' && ['high', 'medium'].includes(u.engagement_level)).length,
      action: () => handleSegmentSelection({
        id: 'active-riders',
        name: 'Active Riders',
        description: 'Regular riders with consistent usage',
        filters: { user_type: 'riders', engagement_level: ['high', 'medium'] },
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Targeting</h2>
          <p className="text-gray-600">Segment and target users for your campaigns</p>
        </div>
        {selectedUsers.length > 0 && (
          <Badge variant="outline" className="text-sm">
            {selectedUsers.length} users selected
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className={`border-2 ${action.color} hover:shadow-md transition-shadow cursor-pointer`} onClick={action.action}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <action.icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.users} users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="segments">User Segments</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Segments</CardTitle>
              <CardDescription>Pre-defined user segments based on behavior and attributes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                      <Skeleton className="h-9 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {segments.map((segment) => (
                    <div key={segment.id} className={`flex items-center justify-between p-4 border rounded-lg ${activeSegmentId === segment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{segment.name}</h3>
                        <p className="text-sm text-gray-600">{segment.description}</p>
                      </div>
                      <Button
                        variant={activeSegmentId === segment.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSegmentSelection(segment)}
                      >
                        {activeSegmentId === segment.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Browse and filter all users in your system</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={engagementFilter} onValueChange={handleEngagementFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by engagement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Engagement</SelectItem>
                    <SelectItem value="high">High Engagement</SelectItem>
                    <SelectItem value="medium">Medium Engagement</SelectItem>
                    <SelectItem value="low">Low Engagement</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Type Tabs */}
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="drivers">Drivers</TabsTrigger>
                  <TabsTrigger value="riders">Riders</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <UserList users={filteredUsers} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="drivers">
                  <UserList 
                    users={filteredUsers.filter(user => user.user_type === 'drivers')} 
                    isLoading={isLoading}
                    emptyMessage="No drivers found matching your criteria"
                  />
                </TabsContent>

                <TabsContent value="riders">
                  <UserList 
                    users={filteredUsers.filter(user => user.user_type === 'riders')} 
                    isLoading={isLoading}
                    emptyMessage="No riders found matching your criteria"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserTargeting;