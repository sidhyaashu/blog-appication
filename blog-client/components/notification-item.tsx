'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { MessageSquare, Heart, CornerDownRight, UserPlus } from 'lucide-react';

interface NotificationItemProps {
    notification: {
        _id: string;
        sender_id: {
            _id: string;
            name: string;
            avatar?: string;
        };
        type: 'reply' | 'comment' | 'clap' | 'follow';
        post_id?: {
            title: string;
            slug: string;
        };
        read: boolean;
        created_at: string;
    };
    onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const { sender_id, type, post_id, read, created_at } = notification;

    let icon = null;
    let message = '';
    let href = '#';

    switch (type) {
        case 'comment':
            icon = <MessageSquare className="w-4 h-4 text-blue-500" />;
            message = 'commented on your post';
            href = post_id ? `/blog/${post_id.slug}` : '#';
            break;
        case 'reply':
            icon = <CornerDownRight className="w-4 h-4 text-green-500" />;
            message = 'replied to your comment in';
            href = post_id ? `/blog/${post_id.slug}#comments` : '#';
            break;
        case 'clap':
            icon = <Heart className="w-4 h-4 text-red-500" />;
            message = 'clapped for your post';
            href = post_id ? `/blog/${post_id.slug}` : '#';
            break;
        case 'follow':
            icon = <UserPlus className="w-4 h-4 text-purple-500" />;
            message = 'started following you';
            href = `/author/${sender_id._id}`;
            break;
    }

    return (
        <div
            className={cn(
                "flex items-start gap-4 p-4 border-b hover:bg-gray-50 transition-colors",
                !read && "bg-blue-50/50"
            )}
            onClick={() => !read && onRead?.(notification._id)}
        >
            <div className="shrink-0 relative">
                {sender_id.avatar ? (
                    <Image
                        src={sender_id.avatar}
                        alt={sender_id.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {sender_id.name.charAt(0)}
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    {icon}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm">
                    <span className="font-semibold">{sender_id.name}</span>{' '}
                    <span className="text-gray-600">{message}</span>{' '}
                    {post_id && (
                        <Link href={href} className="font-medium text-gray-900 hover:underline">
                            {post_id.title}
                        </Link>
                    )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                </p>
            </div>
            {!read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
            )}
        </div>
    );
}
