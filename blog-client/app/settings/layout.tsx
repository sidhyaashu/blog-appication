'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, Lock, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const sidebarItems = [
        {
            title: 'Edit Profile',
            href: '/settings/profile',
            icon: User,
        },
        {
            title: 'Account',
            href: '/settings/account',
            icon: Settings,
        },
        {
            title: 'Password',
            href: '/settings/password',
            icon: Lock,
        },
        {
            title: 'Notifications',
            href: '/settings/notifications',
            icon: Bell,
            disabled: true,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} href={item.disabled ? '#' : item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        pathname === item.href && "bg-muted font-medium",
                                        item.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={item.disabled}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
