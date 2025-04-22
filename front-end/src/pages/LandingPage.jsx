import { Navigation } from '../components/LandingPage/Navigation';
import { Hero } from '../components/LandingPage/Hero';
import { Features } from "../components/LandingPage/Features";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { CallToAction } from "../components/LandingPage/CallToAction";
import { Footer } from "../components/LandingPage/Footer";

function LandingPage() {
  return (
    <div className="overflow-hidden w-full">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
