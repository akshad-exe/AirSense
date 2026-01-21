import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAQICategory } from '@/lib/aqi-utils';

interface AQIDisplayProps {
    aqi: number;
}

export function AQIDisplay({ aqi }: AQIDisplayProps) {
    const category = getAQICategory(aqi);

    return (
        <Card className={`relative overflow-hidden border-0 shadow-2xl transition-all duration-700 ${category.color} group`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />

            <CardContent className="relative p-12 sm:p-20">
                <div className="flex flex-col items-center text-center">
                    {/* Category Badge */}
                    <div className="mb-8 transform hover:scale-110 transition-transform duration-300">
                        <Badge className="bg-background/20 backdrop-blur-xl text-white border-white/30 hover:bg-background/30 text-base px-8 py-2 rounded-full font-black uppercase tracking-[0.2em] shadow-xl">
                            {category.label}
                        </Badge>
                    </div>

                    {/* AQI Value */}
                    <div className="relative">
                        <div className="absolute inset-x-0 -top-4 text-[10rem] sm:text-[14rem] font-black text-white/5 select-none tracking-tighter leading-none">
                            {aqi}
                        </div>
                        <h2 className="text-[8rem] sm:text-[12rem] font-black text-white tracking-tighter leading-none mb-4 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-700">
                            {aqi}
                        </h2>
                    </div>

                    <p className="text-xl sm:text-2xl font-black text-white/90 uppercase tracking-[0.3em] mb-4">
                        Air Quality Index
                    </p>

                    {/* Status Message */}
                    <div className="w-full max-w-md h-px bg-white/20 my-8" />

                    <p className="text-lg text-white/80 font-medium max-w-sm leading-relaxed italic">
                        "The air quality is currently {category.label.toLowerCase()}. {category.label === 'Good' ? 'Perfect for outdoor exploration!' : 'Consider taking precautions if sensitive.'}"
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
