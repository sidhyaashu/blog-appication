'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationItem } from '@/components/notification-item';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

export default function NotificationsPage() {
    const { token, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            const res = await fetch(`${API_URL}/notifications/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                toast.success('Marked all as read');
            }
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const markOneRead = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/notifications/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setNotifications(notifications.map(n =>
                    n._id === id ? { ...n, read: true } : n
                ));
            }
        } catch (error) {
            console.error('Failed to mark read');
        }
    };

    if (authLoading) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                </div>
                {notifications.some(n => !n.read) && (
                    <Button variant="ghost" size="sm" onClick={markAllRead}>
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                        <Bell className="w-12 h-12 mb-4 text-gray-300" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification._id}
                                notification={notification}
                                onRead={markOneRead}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
