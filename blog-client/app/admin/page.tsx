"use client"

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminStats {
    totalPosts: number;
    totalViews: number;
    totalUsers: number;
}

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                } else {
                    toast.error('Failed to load stats');
                }
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                toast.error('Error loading dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your blog performance.</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Create New Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                                <p className="text-xs text-muted-foreground">Published articles</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
                                <p className="text-xs text-muted-foreground">All time views</p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                                <p className="text-xs text-muted-foreground">Registered readers</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
