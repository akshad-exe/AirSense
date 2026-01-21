import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Wind, Droplets } from 'lucide-react';

interface PMCardsProps {
    pm25: number;
    pm10: number;
}

export function PMCards({ pm25, pm10 }: PMCardsProps) {
    // Calculate progress percentage (assuming max values)
    const pm25Progress = Math.min((pm25 / 100) * 100, 100);
    const pm10Progress = Math.min((pm10 / 200) * 100, 100);

    const getPM25Color = (value: number) => {
        if (value <= 12) return 'text-green-600 dark:text-green-400';
        if (value <= 35.4) return 'text-yellow-600 dark:text-yellow-400';
        if (value <= 55.4) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getPM10Color = (value: number) => {
        if (value <= 54) return 'text-green-600 dark:text-green-400';
        if (value <= 154) return 'text-yellow-600 dark:text-yellow-400';
        if (value <= 254) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PM2.5 Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 bg-card border-0 rounded-3xl shadow-xl shadow-primary/5 group">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-4 text-lg">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wind className="w-7 h-7 text-primary" />
                        </div>
                        <span className="text-foreground font-bold text-xl uppercase tracking-tight">PM2.5</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className={`text-5xl font-black mb-4 ${getPM25Color(pm25)}`}>
                        {pm25.toFixed(1)} <span className="text-xl font-normal text-muted-foreground uppercase">µg/m³</span>
                    </div>
                    <Progress value={pm25Progress} className="h-3 mb-4 rounded-full" />
                    <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                        Fine particulate matter (≤ 2.5 micrometers)
                    </p>
                </CardContent>
            </Card>

            {/* PM10 Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 bg-card border-0 rounded-3xl shadow-xl shadow-green-500/5 group">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-4 text-lg">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Droplets className="w-7 h-7 text-green-500" />
                        </div>
                        <span className="text-foreground font-bold text-xl uppercase tracking-tight">PM10</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className={`text-5xl font-black mb-4 ${getPM10Color(pm10)}`}>
                        {pm10.toFixed(1)} <span className="text-xl font-normal text-muted-foreground uppercase">µg/m³</span>
                    </div>
                    <Progress value={pm10Progress} className="h-3 mb-4 rounded-full" />
                    <p className="text-sm text-muted-foreground font-semibold leading-relaxed">
                        Coarse particulate matter (≤ 10 micrometers)
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
