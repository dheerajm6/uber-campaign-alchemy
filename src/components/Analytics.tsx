import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, Clock, TrendingUp, Activity, Filter } from "lucide-react";

const Analytics = () => {
  const [loginStats, setLoginStats] = useState({
    totalLogins: 0,
    userLogins: {},
    lastLogin: null,
    uniqueUsers: 0
  });
  const [loginActivities, setLoginActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'user'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLoginStats = () => {
      try {
        const totalLogins = parseInt(localStorage.getItem('login_count') || '0');
        const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
        const lastLogin = localStorage.getItem('last_login');
        const uniqueUsers = Object.keys(userLogins).length;
        const activities = JSON.parse(localStorage.getItem('login_activities') || '[]');

        // Sort activities by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('Analytics data loaded:', {
          totalLogins,
          userLogins,
          lastLogin,
          uniqueUsers,
          activitiesCount: activities.length
        });

        setLoginStats({
          totalLogins,
          userLogins,
          lastLogin,
          uniqueUsers
        });
        setLoginActivities(activities);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        setIsLoading(false);
      }
    };

    loadLoginStats();
    
    // Refresh every 2 seconds to catch new logins quickly
    const interval = setInterval(loadLoginStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter activities based on role filter
  useEffect(() => {
    if (roleFilter === 'all') {
      setFilteredActivities(loginActivities);
    } else {
      setFilteredActivities(loginActivities.filter(activity => activity.role === roleFilter));
    }
  }, [loginActivities, roleFilter]);

  const chartData = Object.entries(loginStats.userLogins).map(([username, count]) => ({
    username,
    logins: count
  }));

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getBrowserName = (userAgent) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const kpiCards = [
    {
      title: "Total Demo Logins",
      value: loginStats.totalLogins.toString(),
      change: "+100%",
      trend: "up" as const,
      icon: Users,
      description: "All time"
    },
    {
      title: "Unique Demo Users",
      value: loginStats.uniqueUsers.toString(),
      change: "+50%",
      trend: "up" as const,
      icon: Eye,
      description: "Different accounts"
    },
    {
      title: "Demo User Logins",
      value: Object.entries(loginStats.userLogins).filter(([username]) => username !== 'admin').reduce((sum, [, count]) => sum + count, 0).toString(),
      change: "+25%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "Custom usernames"
    },
    {
      title: "Last Login",
      value: loginStats.lastLogin ? new Date(loginStats.lastLogin).toLocaleTimeString() : "Never",
      change: "Recent",
      trend: "up" as const,
      icon: Clock,
      description: "Latest activity"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Login Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="default"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {kpi.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{kpi.description}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <kpi.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Login Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Demo Login Activity</CardTitle>
          <CardDescription>Login frequency by demo account</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="username" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="logins" fill="#000000" name="Login Count" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Login Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Demo Account Usage</CardTitle>
          <CardDescription>Breakdown of demo credential usage</CardDescription>
          {/* Debug info - show raw localStorage data */}
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
            <strong>Debug Info:</strong> login_count: {localStorage.getItem('login_count') || 'null'}, 
            user_logins: {localStorage.getItem('user_logins') || 'null'}, 
            last_login: {localStorage.getItem('last_login') || 'null'}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))
            ) : (
              Object.entries(loginStats.userLogins).map(([username, count]) => (
                <div key={username} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {username === 'admin' ? 'Admin Account' : `Demo User: ${username}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Username: {username} • Password: demo@2024
                      {username === 'admin' && ' (Fixed Admin)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">logins</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Complete Login Activity Log */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Complete Login Activity Log
              </CardTitle>
              <CardDescription>Detailed log of all login sessions ({filteredActivities.length} total)</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Users</option>
                <option value="admin">Admin Only</option>
                <option value="user">Demo Users Only</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No login activities found</p>
              <p className="text-sm">Login activities will appear here once users start logging in</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredActivities.map((activity, index) => {
                const { date, time } = formatTimestamp(activity.timestamp);
                const browser = getBrowserName(activity.userAgent);
                
                return (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        activity.role === 'admin' ? 'bg-blue-600' : 'bg-green-600'
                      }`}>
                        {activity.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{activity.username}</h4>
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              activity.role === 'admin' 
                                ? 'border-blue-200 text-blue-700 bg-blue-50' 
                                : 'border-green-200 text-green-700 bg-green-50'
                            }`}
                          >
                            {activity.role === 'admin' ? 'Admin' : 'Demo User'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{date} at {time}</span>
                          <span>•</span>
                          <span>Browser: {browser}</span>
                          <span>•</span>
                          <span>Session: {activity.sessionId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Login #{loginActivities.length - index}</div>
                      <div className="text-xs">{new Date(activity.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;