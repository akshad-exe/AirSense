import { Button } from '@/components/ui/button';
import { ArrowRight, Wind } from 'lucide-react';

interface HeroProps {
    onGetStarted?: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-foreground/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Icon */}
                    <div className="mb-12 flex justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                                <Wind className="w-24 h-24 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-700/80 to-blue-500 bg-clip-text text-transparent leading-tight">
                        Breathe Better with AirSense
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                        Real-time air quality monitoring for a healthier tomorrow.
                        <br />
                        Track AQI, PM2.5, PM10, and get personalized health recommendations.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-xl font-black rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                            onClick={onGetStarted}
                        >
                            Get Started
                            <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-background/80 backdrop-blur-md px-10 py-7 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-primary/20 hover:border-primary text-foreground"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-muted-foreground font-medium">Real-time Monitoring</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-4xl font-bold text-green-500 mb-2">99.9%</div>
                            <div className="text-muted-foreground font-medium">Accuracy Rate</div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
                            <div className="text-muted-foreground font-medium">Active Users</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
