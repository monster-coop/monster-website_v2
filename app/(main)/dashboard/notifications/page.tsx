"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  CreditCard,
  User,
  Star,
  X,
  Search,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead
} from '@/lib/database/notifications';
import { EnhancedNotification, NotificationType, NotificationPreferences } from '@/lib/types/notifications';
import { getCurrentUser } from '@/lib/auth';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId, activeTab, typeFilter]);

  const initializePage = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        const notificationsData = await loadNotificationsData(user.id);
        setNotifications(notificationsData);
        setPreferences(null);
      }
    } catch (error) {
      console.error('Error initializing notifications page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationsData = async (userId: string) => {
    const options = {
      limit: 50,
      unread_only: activeTab === 'unread',
      type: typeFilter !== 'all' ? typeFilter : undefined
    };
    return await getUserNotifications(userId, options);
  };

  const loadNotifications = async () => {
    if (!userId) return;
    
    try {
      const data = await loadNotificationsData(userId);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!userId) return;
    
    try {
      const result = await markNotificationAsRead(notificationId, userId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    
    try {
      const result = await markAllNotificationsAsRead(userId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleUpdatePreferences = async (updatedPreferences: Partial<NotificationPreferences>) => {
    if (!userId) return;
    
    try {
      // TODO: Implement updateNotificationPreferences function
      console.log('Updating preferences:', updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
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
        return <Bell className="text-gray-600" size={20} />;
      default:
        return <Bell className="text-gray-600" size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">알림을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 센터</h1>
          <p className="text-gray-600">모든 알림을 확인하고 설정을 관리하세요</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mb-6"
        >
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'all', label: '전체', count: notifications.length },
              { id: 'unread', label: '읽지 않음', count: unreadCount },
              { id: 'settings', label: '설정' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'unread' | 'settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#56007C] text-[#56007C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-[#56007C]/10 text-[#56007C]' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </motion.div>

        {activeTab === 'settings' ? (
          /* Settings Tab */
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">알림 설정</h2>
            
            <div className="text-center py-8">
              <p className="text-gray-600">알림 설정 기능은 현재 개발 중입니다.</p>
              <p className="text-gray-500 text-sm mt-2">곧 사용하실 수 있습니다.</p>
            </div>
          </motion.div>
        ) : (
          /* Notifications List */
          <>
            {/* Controls */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="bg-white rounded-lg shadow-sm p-4 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="알림 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                >
                  <option value="all">모든 유형</option>
                  <option value="program">프로그램</option>
                  <option value="payment">결제</option>
                  <option value="subscription">구독</option>
                  <option value="general">일반</option>
                </select>

                {/* Mark All Read */}
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-[#56007C] text-white rounded-lg hover:bg-[#56007C]/90 transition-colors"
                  >
                    <CheckCheck size={16} />
                    모두 읽음
                  </button>
                )}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread' 
                      ? '모든 알림을 읽으셨습니다!' 
                      : '새로운 알림이 도착하면 여기에 표시됩니다.'
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm border-l-4 ${
                      !notification.is_read 
                        ? 'border-l-[#56007C] bg-blue-50/30' 
                        : 'border-l-gray-200'
                    } p-6 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getNotificationIcon(notification.type as NotificationType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`text-lg font-medium ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {notification.created_at ? new Date(notification.created_at).toLocaleString('ko-KR') : '날짜 정보 없음'}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-[#56007C] border border-[#56007C] rounded hover:bg-[#56007C] hover:text-white transition-colors"
                              >
                                <Check size={14} />
                                읽음
                              </button>
                            )}
                            
                            {notification.action_url && (
                              <a
                                href={notification.action_url}
                                className="px-3 py-1 text-sm bg-[#56007C] text-white rounded hover:bg-[#56007C]/90 transition-colors"
                              >
                                확인
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}