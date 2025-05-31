import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CallToAction from "./CallToAction";
import Footer from "./Footer" 
import AboutService from "./AboutService";
import StatisticsSection from "./StatisticSection";


const Landing = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AboutService />
      <Features />
      <HowItWorks />
      <StatisticsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Landing;
