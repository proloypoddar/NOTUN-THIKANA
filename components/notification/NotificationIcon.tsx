'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationIcon: React.FC = () => {
  const [userNotifications, setUserNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  const togglePopup = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/notifications?userId=${session.user.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
  
        const notifications = await response.json();
        setUserNotifications(notifications);
        
        // Count unread notifications
        const unread = notifications.filter((notification: NotificationItem) => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setUserNotifications([]);
      }
    };
  
    fetchNotifications();
    
    // Set up polling for new notifications
    const intervalId = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [session]);
  
  return (
    <div className="relative">
      {/* Notification icon with badge */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={togglePopup}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {/* Popup visibility controlled by isOpen */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border"
        >
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={async () => {
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
                      setUserNotifications(prev => 
                        prev.map(notification => ({
                          ...notification,
                          isRead: true
                        }))
                      );
                      setUnreadCount(0);
                    } catch (error) {
                      console.error('Error marking notifications as read:', error);
                    }
                  }}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {userNotifications.length > 0 ? (
              <ul className="divide-y">
                {userNotifications.slice(0, 5).map((notification) => (
                  <li 
                    key={notification._id} 
                    className={`p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-sm text-gray-600">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </div>
          
          <div className="p-3 border-t text-center">
            <Link 
              href="/notifications" 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
