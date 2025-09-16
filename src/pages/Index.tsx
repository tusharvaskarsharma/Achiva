import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DashboardPreview } from "@/components/DashboardPreview";
import { PortfolioSection } from "@/components/PortfolioSection";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);
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
