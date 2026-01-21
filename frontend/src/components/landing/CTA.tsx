import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CTAProps {
    onGetStarted?: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle email submission
        console.log('Email submitted:', email);
        setEmail('');
    };

    return (
        <section className="py-32 bg-primary relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-700/80 to-blue-600" />

            {/* Animated Circles */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Icon Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-bold uppercase tracking-widest shadow-xl">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            Premium Access
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
                        Ready to <span className="text-blue-200">Breathe</span> Better?
                    </h2>
                    <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        Join thousands of users who are already monitoring their air quality and making healthier choices every day.
                    </p>

                    {/* Email Form */}
                    <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 mb-10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.15] hover:scale-[1.01]">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                            <div className="flex-1 relative group">
                                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white group-focus-within:scale-110 transition-all duration-300 w-6 h-6" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-14 h-16 sm:h-20 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-3xl focus:ring-4 focus:ring-white/30 focus:bg-white/30 transition-all duration-500 text-lg font-medium"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-white text-primary hover:bg-blue-50 h-16 sm:h-20 px-12 rounded-3xl font-black text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 active:scale-95 group"
                            >
                                Get Started
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                            {[
                                'No credit card',
                                'Free 30-day trial',
                                'Cancel anytime'
                            ].map((text) => (
                                <div key={text} className="flex items-center gap-2 text-white/70 font-bold text-sm uppercase tracking-wider">
                                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick CTA Button */}
                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/5 border-2 border-white/30 text-white hover:bg-white hover:text-primary px-12 py-8 text-xl rounded-full shadow-2xl hover:shadow-white/10 transition-all duration-500 backdrop-blur-sm font-black tracking-tight"
                            onClick={onGetStarted}
                        >
                            View Interactive Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
