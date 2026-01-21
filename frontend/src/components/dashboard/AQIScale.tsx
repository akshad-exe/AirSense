import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const aqiCategories = [
    { range: '0-50', label: 'Good', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
    { range: '51-100', label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { range: '101-150', label: 'Unhealthy for Sensitive', color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' },
    { range: '151-200', label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400' },
    { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' },
    { range: '301+', label: 'Hazardous', color: 'bg-rose-900', textColor: 'text-rose-700 dark:text-rose-400' },
];

export function AQIScale() {
    return (
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg text-foreground font-bold">AQI Scale Reference</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {aqiCategories.map((category) => (
                        <div key={category.range} className="flex items-center gap-3 group">
                            <div className={`w-20 h-9 ${category.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                                <span className="text-xs font-bold text-white">{category.range}</span>
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${category.textColor}`}>{category.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
