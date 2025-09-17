import { Award, Shield, FileText, BarChart3, Upload, Users, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload & Tracking",
      description: "Upload certificates, course completions, and achievement records with drag-and-drop simplicity.",
      color: "primary"
    },
    {
      icon: Shield,
      title: "Faculty Verification",
      description: "Secure approval system where faculty validates and verifies student achievements in real-time.",
      color: "accent"
    },
    {
      icon: FileText,
      title: "Digital Portfolios",
      description: "Auto-generate beautiful PDF portfolios or shareable web links showcasing verified achievements.",
      color: "success"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track progress with detailed analytics showing participation trends and performance highlights.",
      color: "warning"
    }
  ];

  const workflows = [
    {
      step: "01",
      title: "Student Uploads",
      description: "Students upload achievement documents, certificates, and activity records",
      icon: Upload
    },
    {
      step: "02", 
      title: "Faculty Review",
      description: "Faculty members review and verify the authenticity of submitted records",
      icon: Users
    },
    {
      step: "03",
      title: "Instant Verification",
      description: "Approved achievements are instantly verified and added to student profiles",
      icon: CheckCircle
    },
    {
      step: "04",
      title: "Portfolio Generation",
      description: "Generate professional portfolios showcasing all verified achievements",
      icon: Download
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Features Grid */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for 
            <span className="hero-gradient bg-clip-text text-transparent"> Academic Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to track, validate, and showcase your academic journey in one comprehensive platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="achievement-card text-center group hover:scale-105 transition-transform animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`hero-gradient p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-card-foreground mb-4">How It Works</h3>
            <p className="text-muted-foreground text-lg">Simple 4-step process to get your achievements verified and showcased</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflows.map((workflow, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="hero-gradient text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {workflow.step}
                </div>
                
                {/* Icon */}
                <div className="bg-secondary p-3 rounded-lg w-fit mx-auto mb-4">
                  <workflow.icon className="h-6 w-6 text-primary" />
                </div>
                
                {/* Content */}
                <h4 className="font-semibold text-card-foreground mb-2">{workflow.title}</h4>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
                
                {/* Connector Line */}
                {index < workflows.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent transform -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Start Tracking Achievements
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};