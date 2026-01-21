import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { MainLayout } from './components/layout';
import { LandingPage, DashboardPage, HistoryPage, DevicesPage, SettingsPage, NotFoundPage } from './pages';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Landing Page - No Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Dashboard Pages - With Layout */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/history"
            element={
              <MainLayout>
                <HistoryPage />
              </MainLayout>
            }
          />
          <Route
            path="/devices"
            element={
              <MainLayout>
                <DevicesPage />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
