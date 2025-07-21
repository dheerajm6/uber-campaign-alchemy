import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, Clock, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [loginStats, setLoginStats] = useState({
    totalLogins: 0,
    userLogins: {},
    lastLogin: null,
    uniqueUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLoginStats = () => {
      try {
        const totalLogins = parseInt(localStorage.getItem('login_count') || '0');
        const userLogins = JSON.parse(localStorage.getItem('user_logins') || '{}');
        const lastLogin = localStorage.getItem('last_login');
        const uniqueUsers = Object.keys(userLogins).length;

        console.log('Analytics data loaded:', {
          totalLogins,
          userLogins,
          lastLogin,
          uniqueUsers
        });

        setLoginStats({
          totalLogins,
          userLogins,
          lastLogin,
          uniqueUsers
        });
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

  const chartData = Object.entries(loginStats.userLogins).map(([username, count]) => ({
    username,
    logins: count
  }));

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
    </div>
  );
};

export default Analytics;