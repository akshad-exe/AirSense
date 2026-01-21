import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wind, Droplets } from 'lucide-react';

// Sample AQI data for preview
const sampleAQIData = [
    { city: 'New York', aqi: 45, category: 'Good', color: 'bg-green-500' },
    { city: 'Los Angeles', aqi: 85, category: 'Moderate', color: 'bg-yellow-500' },
    { city: 'Chicago', aqi: 120, category: 'Unhealthy', color: 'bg-orange-500' },
];

export function AQIPreview() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sampleAQIData.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const currentData = sampleAQIData[currentIndex];

    return (
        <section className="py-20 bg-background overflow-hidden relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-x-0 -top-20 h-64 blur-3xl opacity-20 bg-primary/30 rounded-full" />
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent relative">
                        Live AQI Dashboard Preview
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto relative">
                        See real-time air quality data from cities around the world
                    </p>
                </div>

                {/* Preview Dashboard */}
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Main AQI Display */}
                        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                            <CardHeader className="relative">
                                <CardTitle className="text-white flex items-center justify-between">
                                    <span className="text-2xl font-bold tracking-tight">{currentData.city}</span>
                                    <Badge className={`${currentData.color} text-white border-0 shadow-lg px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-xs`}>
                                        {currentData.category}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative py-12">
                                <div className="text-center">
                                    <div className="text-9xl font-black mb-4 tracking-tighter transition-all duration-500 transform group-hover:scale-110 drop-shadow-2xl">{currentData.aqi}</div>
                                    <div className="text-xl opacity-90 font-bold uppercase tracking-widest text-blue-100">Air Quality Index</div>
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/20">
                                    <p className="text-sm opacity-80 flex items-center justify-center gap-2 font-medium">
                                        <Activity className="w-4 h-4 animate-pulse" />
                                        System synced and broadcasting live
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metrics Cards */}
                        <div className="space-y-4">
                            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-3xl shadow-xl shadow-primary/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg text-foreground transition-colors group-hover:text-primary">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <Wind className="w-5 h-5 text-primary" />
                                        </div>
                                        PM2.5
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-primary mb-1">
                                        {(Math.random() * 50 + 10).toFixed(1)} <span className="text-lg font-normal text-muted-foreground">µg/m³</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Ultra-fine particulate matter</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-3xl shadow-xl shadow-green-500/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg text-foreground transition-colors group-hover:text-green-500">
                                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <Droplets className="w-5 h-5 text-green-500" />
                                        </div>
                                        PM10
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-green-500 mb-1">
                                        {(Math.random() * 100 + 20).toFixed(1)} <span className="text-lg font-normal text-muted-foreground">µg/m³</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">Coarse particulate matter</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-3xl shadow-xl shadow-purple-500/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg text-foreground transition-colors group-hover:text-purple-500">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <Activity className="w-5 h-5 text-purple-500" />
                                        </div>
                                        Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse ring-4 ring-green-500/20" />
                                        <span className="text-lg font-black text-foreground uppercase tracking-wider">Live Online</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">Global sensor network active</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* City Indicators */}
                    <div className="flex justify-center gap-3 mt-12">
                        {sampleAQIData.map((_, index) => (
                            <button
                                key={index}
                                className={`h-2.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-primary w-16 shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'bg-muted-foreground/20 w-4 hover:bg-muted-foreground/40'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
