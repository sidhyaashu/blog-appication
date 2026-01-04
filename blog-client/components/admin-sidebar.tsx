'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">Ovanthra Admin</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                pathname === item.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-gray-800">
                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white hover:bg-gray-800">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
