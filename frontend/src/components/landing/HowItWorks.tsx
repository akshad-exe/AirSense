import { Cloud, LineChart, Lightbulb, Radio } from 'lucide-react';

const steps = [
    {
        icon: Radio,
        title: 'Sensor Detection',
        description: 'Our advanced sensors continuously monitor air quality parameters in real-time.',
        step: '01',
    },
    {
        icon: Cloud,
        title: 'Data Processing',
        description: 'Collected data is processed and analyzed using sophisticated algorithms.',
        step: '02',
    },
    {
        icon: LineChart,
        title: 'Visualization',
        description: 'View comprehensive dashboards with easy-to-understand charts and metrics.',
        step: '03',
    },
    {
        icon: Lightbulb,
        title: 'Recommendations',
        description: 'Receive personalized health suggestions based on current air quality.',
        step: '04',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        How It Works
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Simple, efficient, and reliable air quality monitoring in four easy steps
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative group">
                                    <div className="bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 relative">
                                        {/* Step Number */}
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:-top-6 lg:-right-6 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl ring-8 ring-background">
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className="mb-6 flex justify-center mt-4 lg:mt-0">
                                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                                <Icon className="w-10 h-10 text-primary" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold mb-3 text-center text-foreground">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground text-center leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
