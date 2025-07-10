"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Check,
  Trash2,
  Settings,
  X,
  Calendar,
  CreditCard,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Star
} from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/database/notifications';
import { EnhancedNotification, NotificationType } from '@/lib/types/notifications';

interface NotificationCenterProps {
  userId: string;
  className?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
};

export function NotificationCenter({ userId, className = "" }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(userId, { limit: 20 });
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsRead(notificationId, userId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsRead(userId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'program':
        return <Calendar className="text-blue-600" size={20} />;
      case 'payment':
        return <CreditCard className="text-green-600" size={20} />;
      case 'subscription':
        return <User className="text-indigo-600" size={20} />;
      case 'general':
        return <Info className="text-gray-600" size={20} />;
      default:
        return <Info className="text-gray-600" size={20} />;
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'program':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'subscription':
        return 'bg-indigo-50 border-indigo-200';
      case 'general':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#56007C] transition-colors"
        aria-label="알림"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              {...fadeInUp}
              className="absolute right-0 top-12 w-80 lg:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Bell className="text-[#56007C]" size={20} />
                  <h3 className="font-semibold text-gray-900">알림</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {unreadCount}개
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-[#56007C] hover:underline"
                    >
                      모두 읽음
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#56007C] mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">알림을 불러오는 중...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">새로운 알림이 없습니다</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        layout
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            handleMarkAsRead(notification.id);
                          }
                          if (notification.action_url) {
                            window.location.href = notification.action_url;
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.type as NotificationType)}`}>
                            {getNotificationIcon(notification.type as NotificationType)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-medium ${
                                !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.created_at || '')}
                              </span>
                              
                              {!notification.is_read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-xs text-[#56007C] hover:underline"
                                >
                                  읽음
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      window.location.href = '/dashboard/notifications';
                    }}
                    className="w-full text-sm text-[#56007C] hover:underline"
                  >
                    모든 알림 보기
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}