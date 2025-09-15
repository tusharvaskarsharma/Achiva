import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { PortfolioSection } from "@/components/PortfolioSection";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <PortfolioSection />
      <AnalyticsSection />
      <Footer />
    </div>
  );
};

export default Index;
