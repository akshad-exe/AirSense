import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type AQIData, getAQICategory, formatTimestamp } from '@/lib/aqi-utils';
import { Wind, Activity, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AQIDashboardProps {
    data: AQIData;
}

export function AQIDashboard({ data }: AQIDashboardProps) {
    const category = getAQICategory(data.aqi);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            AirSense Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Real-time Air Quality Monitoring
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.deviceStatus === 'online' ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1.5 px-3 py-1.5">
                                <Wifi className="h-3.5 w-3.5" />
                                Device Online
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="gap-1.5 px-3 py-1.5">
                                <WifiOff className="h-3.5 w-3.5" />
                                Device Offline
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Main AQI Display */}
                <Card className="border-2 shadow-2xl overflow-hidden relative">
                    <div className={cn('absolute inset-0 opacity-10', category.gradient)} />
                    <CardContent className="p-8 relative">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="flex items-center gap-3">
                                <Activity className={cn('h-8 w-8', category.color)} />
                                <h2 className="text-2xl font-semibold text-muted-foreground">
                                    Air Quality Index
                                </h2>
                            </div>

                            <div className="relative">
                                <div className={cn(
                                    'text-9xl font-bold bg-clip-text text-transparent',
                                    category.gradient
                                )}>
                                    {data.aqi}
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <div className={cn(
                                        'w-4 h-4 rounded-full animate-pulse',
                                        data.deviceStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                                    )} />
                                </div>
                            </div>

                            <Badge
                                className={cn(
                                    'text-lg px-6 py-2 font-semibold',
                                    category.gradient,
                                    'text-white border-0 shadow-lg'
                                )}
                            >
                                {category.label}
                            </Badge>

                            <p className="text-sm text-muted-foreground">
                                Last updated: {formatTimestamp(data.timestamp)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* PM2.5 and PM10 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PM2.5 Card */}
                    <Card className="border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <Wind className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                PM2.5 Concentration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                                        {data.pm25.toFixed(1)}
                                    </span>
                                    <span className="text-2xl text-muted-foreground">μg/m³</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Fine particulate matter (≤2.5 micrometers)
                                </p>
                                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                        style={{ width: `${Math.min((data.pm25 / 100) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PM10 Card */}
                    <Card className="border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                                    <Wind className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                PM10 Concentration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                                        {data.pm10.toFixed(1)}
                                    </span>
                                    <span className="text-2xl text-muted-foreground">μg/m³</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Coarse particulate matter (≤10 micrometers)
                                </p>
                                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                                        style={{ width: `${Math.min((data.pm10 / 200) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Health Suggestion Card */}
                <Card className="border-2 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className={cn('p-2 rounded-lg', category.gradient)}>
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                            Health Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-lg leading-relaxed">
                                {category.healthSuggestion}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                        General Public
                                    </h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {data.aqi <= 100 ? 'Safe for outdoor activities' : 'Limit outdoor exposure'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                        Sensitive Groups
                                    </h4>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        {data.aqi <= 50 ? 'No precautions needed' : 'Take extra precautions'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                                        Indoor Quality
                                    </h4>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        {data.aqi > 200 ? 'Keep windows closed' : 'Ventilation recommended'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AQI Scale Reference */}
                <Card className="border shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">AQI Scale Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { range: '0-50', label: 'Good', color: 'bg-green-500' },
                                { range: '51-100', label: 'Moderate', color: 'bg-yellow-500' },
                                { range: '101-200', label: 'Poor', color: 'bg-orange-500' },
                                { range: '201-300', label: 'Very Poor', color: 'bg-red-500' },
                                { range: '301-500', label: 'Severe', color: 'bg-red-900' },
                            ].map((item) => (
                                <div key={item.range} className="flex flex-col items-center gap-2">
                                    <div className={cn('w-full h-12 rounded-lg', item.color)} />
                                    <div className="text-center">
                                        <p className="font-semibold text-sm">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.range}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
