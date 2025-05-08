'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check, Trash2, Settings, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  urgency: string;
  image?: string;
  description?: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    listings: true,
    messages: true,
    forums: true,
    blogs: true,
    announcements: true,
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: false
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/notifications?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [session]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!session?.user?.id) return;
    
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAllAsRead: true,
          userId: session.user.id
        }),
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = (id: string) => {
    // In a real app, you would call an API to delete the notification
    setNotifications(notifications.filter(notification => notification._id !== id));
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'urgent' ? 'bg-red-500' : 'bg-blue-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listing':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'forum':
        return <Bell className="h-5 w-5 text-purple-500" />;
      case 'blog':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    return notification.type === activeTab;
  });

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
            <CardDescription>Manage your notifications and preferences</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.isRead)}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSettings}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {showSettings ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Notification Types</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="listings">Property Listings</Label>
                      <Switch 
                        id="listings" 
                        checked={preferences.listings}
                        onCheckedChange={(checked) => handlePreferenceChange('listings', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="messages">Messages</Label>
                      <Switch 
                        id="messages" 
                        checked={preferences.messages}
                        onCheckedChange={(checked) => handlePreferenceChange('messages', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="forums">Forum Activity</Label>
                      <Switch 
                        id="forums" 
                        checked={preferences.forums}
                        onCheckedChange={(checked) => handlePreferenceChange('forums', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blogs">Blog Updates</Label>
                      <Switch 
                        id="blogs" 
                        checked={preferences.blogs}
                        onCheckedChange={(checked) => handlePreferenceChange('blogs', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="announcements">Announcements</Label>
                      <Switch 
                        id="announcements" 
                        checked={preferences.announcements}
                        onCheckedChange={(checked) => handlePreferenceChange('announcements', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Delivery Methods</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch 
                        id="emailNotifications" 
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <Switch 
                        id="pushNotifications" 
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="soundEnabled">Sound Alerts</Label>
                      <Switch 
                        id="soundEnabled" 
                        checked={preferences.soundEnabled}
                        onCheckedChange={(checked) => handlePreferenceChange('soundEnabled', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleToggleSettings}>
                  Save Preferences
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="listing">Listings</TabsTrigger>
                  <TabsTrigger value="message">Messages</TabsTrigger>
                  <TabsTrigger value="forum">Forums</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <div 
                          key={notification._id} 
                          className={`flex border rounded-lg overflow-hidden transition-all duration-200 ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                        >
                          <div className={`w-1 ${getUrgencyColor(notification.urgency)}`}></div>
                          <div className="flex-1 p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-4 mt-1">
                                {getTypeIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                
                                <p className="text-gray-600 mt-1">{notification.message}</p>
                                
                                {notification.type === 'listing' && notification.image && (
                                  <div className="mt-3 flex items-center">
                                    <div className="w-20 h-20 rounded-md overflow-hidden">
                                      <img 
                                        src={notification.image} 
                                        alt="Property" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="ml-4">
                                      <span className="text-sm text-gray-500">New listing in your area</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-end space-x-2">
                              {!notification.isRead && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleMarkAsRead(notification._id)}
                                >
                                  <Check className="mr-2 h-3 w-3" />
                                  Mark as read
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteNotification(notification._id)}
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                        <Bell className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        You'll receive notifications here when there are updates to your listings, messages, or when you receive announcements.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
