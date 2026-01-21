import { Activity, Bell, BarChart3, Shield, Smartphone, Zap } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
    {
        icon: Activity,
        title: 'Real-time Monitoring',
        description: 'Get instant updates on air quality metrics including AQI, PM2.5, and PM10 levels.',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-500/10',
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Receive notifications when air quality changes significantly in your area.',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-500/10',
    },
    {
        icon: BarChart3,
        title: 'Historical Data',
        description: 'Analyze trends and patterns with comprehensive historical air quality data.',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-500/10',
    },
    {
        icon: Shield,
        title: 'Health Recommendations',
        description: 'Get personalized health suggestions based on current air quality conditions.',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-500/10',
    },
    {
        icon: Smartphone,
        title: 'Multi-device Support',
        description: 'Access your air quality data seamlessly across all your devices.',
        color: 'text-pink-600 dark:text-pink-400',
        bgColor: 'bg-pink-500/10',
    },
    {
        icon: Zap,
        title: 'Fast & Reliable',
        description: 'Lightning-fast updates with 99.9% uptime guarantee for continuous monitoring.',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10',
    },
];

export function Features() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        Powerful Features
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to monitor and improve the air quality around you
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm hover:-translate-y-2 rounded-3xl shadow-xl shadow-primary/5"
                            >
                                <CardHeader>
                                    <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <Icon className={`w-7 h-7 ${feature.color}`} />
                                    </div>
                                    <CardTitle className="text-2xl mb-2 text-foreground">{feature.title}</CardTitle>
                                    <CardDescription className="text-base text-muted-foreground">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
