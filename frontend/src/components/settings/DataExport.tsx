import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface DataExportProps {
    onExport?: (format: 'json' | 'csv') => void;
    onImport?: () => void;
}

export function DataExport({ onExport, onImport }: DataExportProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or import your air quality data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Export Section */}
                <div>
                    <h3 className="text-sm font-medium mb-3">Export Data</h3>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onExport?.('json')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export as JSON
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onExport?.('csv')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export as CSV
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Download all your historical air quality data
                    </p>
                </div>

                {/* Import Section */}
                <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Import Data</h3>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onImport}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                        Import previously exported data
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
