'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('keyword') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (query) {
            params.set('keyword', query);
        } else {
            params.delete('keyword');
        }

        // Reset page to 1 when searching
        params.delete('pageNumber');

        router.push(`/?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-sm hidden sm:block">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search posts..."
                    className="w-full pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>
    );
}
