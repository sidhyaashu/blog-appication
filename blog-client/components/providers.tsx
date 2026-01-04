'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
                {children}
            </GoogleOAuthProvider>
        </Provider>
    );
}
