import { useNavigate } from 'react-router-dom';
import { Navbar, Hero, Features, HowItWorks, AQIPreview, CTA, Footer } from '@/components/landing';

export function LandingPage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            <Navbar onGetStarted={handleGetStarted} />

            <main>
                <Hero onGetStarted={handleGetStarted} />

                <section id="features" className="scroll-mt-20">
                    <Features />
                </section>

                <section id="how-it-works" className="scroll-mt-20">
                    <HowItWorks />
                </section>

                <section id="dashboard" className="scroll-mt-20">
                    <AQIPreview />
                </section>

                <section id="pricing" className="scroll-mt-20">
                    <CTA onGetStarted={handleGetStarted} />
                </section>
            </main>

            <Footer />
        </div>
    );
}
