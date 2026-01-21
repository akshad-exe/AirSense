import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface HistoryChartProps {
    data: Array<{
        timestamp: string;
        aqi: number;
        pm25: number;
        pm10: number;
    }>;
}

export function HistoryChart({ data }: HistoryChartProps) {
    return (
        <Card className="hover:shadow-xl transition-all duration-300 bg-card border-border">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Activity className="w-6 h-6 text-primary" />
                            Air Quality Trends
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground">
                            Real-time monitoring of AQI, PM2.5, and PM10 levels
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-muted-foreground">Last 24 hours</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[400px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            fontWeight={500}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            fontWeight={500}
                            tickLine={false}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-background/95 backdrop-blur-md p-4 border border-border shadow-xl rounded-xl">
                                            <p className="text-sm font-bold text-foreground mb-3 border-b border-border pb-2">
                                                {label ? new Date(label).toLocaleString() : ''}
                                            </p>
                                            <div className="space-y-2">
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center justify-between gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded-full"
                                                                style={{ backgroundColor: entry.color }}
                                                            />
                                                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold" style={{ color: entry.color }}>
                                                            {entry.value}
                                                            {entry.name !== 'AQI' && ' µg/m³'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                            formatter={(value) => <span className="text-sm font-semibold text-foreground">{value}</span>}
                        />

                        {/* AQI Line - Primary Blue */}
                        <Line
                            type="monotone"
                            dataKey="aqi"
                            name="AQI"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6, fill: '#3b82f6' }}
                            animationDuration={1000}
                        />

                        {/* PM2.5 Line - Green */}
                        <Line
                            type="monotone"
                            dataKey="pm25"
                            name="PM2.5"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            dot={{ fill: '#10b981', r: 3 }}
                            activeDot={{ r: 5, fill: '#10b981' }}
                            animationDuration={1000}
                        />

                        {/* PM10 Line - Orange */}
                        <Line
                            type="monotone"
                            dataKey="pm10"
                            name="PM10"
                            stroke="#f97316"
                            strokeWidth={2.5}
                            dot={{ fill: '#f97316', r: 3 }}
                            activeDot={{ r: 5, fill: '#f97316' }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
