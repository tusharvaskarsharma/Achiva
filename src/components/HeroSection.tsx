import { Button } from "@/components/ui/button";
import { Award, Upload, Users, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-achievement.jpg";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 subtle-gradient" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-up">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Track & Showcase Your
                <span className="hero-gradient bg-clip-text text-transparent"> Academic Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Centralized platform for students to track achievements, validate credentials, 
                and create stunning digital portfolios. From academics to extracurriculars, 
                showcase your complete educational story.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg px-8 py-3">
                  Start Your Journey
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="hero-gradient p-3 rounded-lg w-fit mx-auto mb-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
              <div className="text-center">
                <div className="hero-gradient p-3 rounded-lg w-fit mx-auto mb-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">1,200</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="hero-gradient p-3 rounded-lg w-fit mx-auto mb-2">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">2,500</div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
              <div className="text-center">
                <div className="hero-gradient p-3 rounded-lg w-fit mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Students celebrating academic achievements"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 hero-gradient opacity-20" />
            </div>
            
            {/* Floating Achievement Card */}
            <div className="absolute -bottom-6 -left-6 achievement-card animate-float max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-success p-2 rounded-full">
                  <Award className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">Certificate Verified!</div>
                  <div className="text-sm text-muted-foreground">Data Science Course</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};