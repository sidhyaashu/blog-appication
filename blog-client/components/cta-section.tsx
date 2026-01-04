import { ArrowRight, Link as LinkIcon, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function CtaSection() {
    return (
        <section className="container mx-auto px-4 py-24 mb-16">
            {/* Top Info Section */}
            <div className="mb-20">
                <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 gap-1 rounded-full px-4 py-1.5 font-normal">
                    <LinkIcon className="w-3 h-3" />
                    New Agent Framework Released
                </Badge>

                <div className="flex flex-col lg:flex-row gap-16 justify-between">
                    <div className="max-w-xl">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                            Get started with Ibanera
                        </h2>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            Explore Ibanera, or create an account instantly and start accepting payments.
                            You can also contact us to design a custom package for your business.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-12 lg:gap-20">
                        <div className="space-y-4 relative pl-6 border-l-2 border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Feature 1</h3>
                            <p className="text-gray-500 text-sm max-w-[200px]">
                                Integrated per-transaction pricing with no hidden fees.
                            </p>
                            <Link href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline">
                                Pricing details <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>

                        <div className="space-y-4 relative pl-6 border-l-2 border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Feature 2</h3>
                            <p className="text-gray-500 text-sm max-w-[200px]">
                                Get up and running with Ibanera in as little as 10 minutes.
                            </p>
                            <Link href="#" className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline">
                                API reference <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Blue Banner */}
            <div className="relative rounded-[2.5rem] bg-[#3B5BDB] overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12">
                {/* Background decorative mesh/gradient elements could go here */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#4C6EF5] to-[#3B5BDB]"></div>

                {/* Grid lines illusion - simplifying with CSS */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        transform: 'perspective(500px) rotateX(20deg) scale(1.5) translateY(50px)'
                    }}
                />

                <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-8">
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                        <Square className="w-8 h-8 text-[#3B5BDB] fill-current" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Powering the next generation of AI
                    </h2>

                    <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl">
                        When it comes to understanding future intelligence, Ovanthra is your trusted source for in-depth analysis and breakthroughs.
                    </p>

                    <Link href="/#categories">
                        <Button className="bg-white text-[#3B5BDB] hover:bg-blue-50 text-base px-8 py-6 rounded-lg font-bold mt-4 group">
                            Start Reading
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
