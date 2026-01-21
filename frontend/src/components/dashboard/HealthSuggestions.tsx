import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Users, Home, AlertTriangle } from 'lucide-react';
import { getAQICategory } from '@/lib/aqi-utils';

interface HealthSuggestionsProps {
    aqi: number;
    category?: string;
}

export function HealthSuggestions({ aqi, category }: HealthSuggestionsProps) {
    const aqiCategory = category || getAQICategory(aqi);

    const getSuggestions = () => {
        if (aqi <= 50) {
            return {
                general: 'Air quality is satisfactory. Enjoy outdoor activities!',
                sensitive: 'No restrictions for sensitive groups.',
                indoor: 'Good time to ventilate your home.',
                icon: Heart,
                color: 'text-green-600 dark:text-green-400',
                bgColor: 'bg-green-500/10 border-green-500/20',
            };
        } else if (aqi <= 100) {
            return {
                general: 'Air quality is acceptable for most people.',
                sensitive: 'Sensitive individuals should limit prolonged outdoor exertion.',
                indoor: 'Consider keeping windows closed during peak hours.',
                icon: Users,
                color: 'text-yellow-600 dark:text-yellow-400',
                bgColor: 'bg-yellow-500/10 border-yellow-500/20',
            };
        } else if (aqi <= 150) {
            return {
                general: 'Everyone may begin to experience health effects.',
                sensitive: 'Sensitive groups should avoid outdoor activities.',
                indoor: 'Keep windows closed and use air purifiers.',
                icon: AlertTriangle,
                color: 'text-orange-600 dark:text-orange-400',
                bgColor: 'bg-orange-500/10 border-orange-500/20',
            };
        } else {
            return {
                general: 'Health alert: everyone may experience serious health effects.',
                sensitive: 'Sensitive groups should remain indoors.',
                indoor: 'Keep windows closed and use HEPA air purifiers.',
                icon: AlertTriangle,
                color: 'text-red-600 dark:text-red-400',
                bgColor: 'bg-red-500/10 border-red-500/20',
            };
        }
    };

    const suggestions = getSuggestions();
    const Icon = suggestions.icon;

    // Determine category label
    const categoryLabel = typeof aqiCategory === 'string' ? aqiCategory : aqiCategory.label;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${suggestions.color}`} />
                    Health Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* General Population */}
                <Alert className={suggestions.bgColor}>
                    <Heart className={`w-4 h-4 ${suggestions.color}`} />
                    <AlertDescription className="text-foreground">
                        <strong>General:</strong> {suggestions.general}
                    </AlertDescription>
                </Alert>

                {/* Sensitive Groups */}
                <Alert className={suggestions.bgColor}>
                    <Users className={`w-4 h-4 ${suggestions.color}`} />
                    <AlertDescription className="text-foreground">
                        <strong>Sensitive Groups:</strong> {suggestions.sensitive}
                    </AlertDescription>
                </Alert>

                {/* Indoor Advice */}
                <Alert className={suggestions.bgColor}>
                    <Home className={`w-4 h-4 ${suggestions.color}`} />
                    <AlertDescription className="text-foreground">
                        <strong>Indoor:</strong> {suggestions.indoor}
                    </AlertDescription>
                </Alert>

                {/* Current Category */}
                <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Current air quality: <strong className={suggestions.color}>{categoryLabel}</strong>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
