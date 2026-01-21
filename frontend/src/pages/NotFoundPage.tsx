import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground" />
                    </div>
                </div>

                {/* 404 Text */}
                <div className="space-y-4">
                    <h1 className="text-8xl md:text-9xl font-bold text-foreground">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                        <Button className="gap-2 min-w-[160px]">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button variant="outline" className="gap-2 min-w-[160px]">
                            <Search className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Additional Help */}
                <div className="pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Need help? <a href="mailto:support@airsense.com" className="text-primary hover:underline font-medium">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
