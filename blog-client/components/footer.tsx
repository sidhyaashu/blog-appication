'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="text-xl font-bold">Ovanthra</span>
            </div>
            <p className="text-gray-600 text-sm">
              Ovanthra, your premier destination for the latest in AI Agents, Tech Innovations, and Future Intelligence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/protection" className="hover:text-gray-900">
                  Project Protection
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gray-900">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link href="/getting-started" className="hover:text-gray-900">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-gray-900">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:text-gray-900">
                  Referral Program
                </Link>
              </li>
              <li>
                <Link href="/network-status" className="hover:text-gray-900">
                  Network Status
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="https://whatsapp.com"
                target="_blank"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-gray-600 text-sm">
          © Copyright 2024 Ovanthra. All right Reserved
        </div>
      </div>
    </footer>
  );
}
