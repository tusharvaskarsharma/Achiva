import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Download, Share2, ExternalLink, GraduationCap, Calendar, Trophy, Code, User, Mail } from "lucide-react";
import { toast } from "sonner";

interface PortfolioData {
  id: string;
  title: string;
  description: string;
  project_url: string;
  image_url: string | null;
  technologies: string[];
  status: string;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
}

interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: string;
  description: string;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
}

interface UserProfile {
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  university: string | null;
  degree: string | null;
  graduation_year: number | null;
  skills: string[] | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  created_at: string;
}

interface PortfolioStats {
  total_projects: number;
  completed_projects: number;
  total_certificates: number;
  total_study_hours: number;
}

const Portfolio = () => {
  const { userId } = useParams();
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const portfolioRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (portfolioRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Portfolio - ${userProfile?.full_name || 'Student'}</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 32px; }
                .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
                .verified { background: #dcfce7; color: #166534; }
                .status { background: #f3f4f6; color: #374151; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${portfolioRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          toast.success("Portfolio PDF generated successfully!");
        }, 250);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPortfolioData();
    }
  }, [userId]);

  const fetchPortfolioData = async () => {
    try {
      if (!userId) return;

      // Use the new database function to get all portfolio data
      const { data, error } = await supabase.rpc('get_user_portfolio_data', { 
        target_user_id: userId 
      });

      if (error) throw error;

      if (data) {
        const portfolioData = data as any;
        setPortfolios(portfolioData.portfolios || []);
        setCertificates(portfolioData.certificates || []);
        setStats(portfolioData.stats || { total_projects: 0, completed_projects: 0, total_certificates: 0, total_study_hours: 0 });
        
        // Handle user profile - combine database profile with auth data if needed
        let profile = portfolioData.user_profile;
        if (!profile || !profile.user_id) {
          // If no profile exists, get auth data and create basic profile
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            profile = {
              user_id: user.id,
              full_name: user.email?.split('@')[0] || 'Student',
              bio: null,
              avatar_url: null,
              university: null,
              degree: null,
              graduation_year: null,
              skills: null,
              linkedin_url: null,
              github_url: null,
              website_url: null,
              created_at: user.created_at || new Date().toISOString()
            };
          } else {
            // Public view with no profile
            profile = {
              user_id: userId,
              full_name: 'Student',
              bio: null,
              avatar_url: null,
              university: null,
              degree: null,
              graduation_year: null,
              skills: null,
              linkedin_url: null,
              github_url: null,
              website_url: null,
              created_at: new Date().toISOString()
            };
          }
        }
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast.error("Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const portfolioUrl = `${window.location.origin}/portfolio/${userId}`;
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      toast.success("Portfolio link copied to clipboard!");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Failed to copy link");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return <GraduationCap className="h-4 w-4" />;
      case 'technical': return <Code className="h-4 w-4" />;
      case 'internship': return <Trophy className="h-4 w-4" />;
      case 'online_courses': return <Trophy className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-green-100 text-green-800';
      case 'online_courses': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Digital Portfolio</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="container mx-auto p-6" ref={portfolioRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="hero-gradient text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {userProfile?.full_name?.toUpperCase() || userProfile?.user_id?.split('-')[0]?.toUpperCase() || 'STUDENT'}
                  </h1>
                  <p className="text-white/80 text-lg">Academic Portfolio</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-white/70">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{userProfile?.full_name || 'Student Portfolio'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Member since {new Date(userProfile?.created_at || '').getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats?.total_projects || 0}</div>
                <p className="text-muted-foreground text-sm">Verified Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats?.total_certificates || 0}</div>
                <p className="text-muted-foreground text-sm">Certificates Earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats?.completed_projects || 0}</div>
                <p className="text-muted-foreground text-sm">Completed Projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          {portfolios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Academic Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {portfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{portfolio.title}</h3>
                            <p className="text-muted-foreground mt-1">{portfolio.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant={portfolio.status === 'completed' ? 'default' : 'secondary'}>
                                {portfolio.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            </div>
                            {portfolio.technologies && portfolio.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {portfolio.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {portfolio.project_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        {portfolio.verified_at && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Verified on {new Date(portfolio.verified_at).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificates Section */}
          {certificates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievements & Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(certificate.category)}
                              <h3 className="font-semibold">{certificate.title}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">
                              Issued by {certificate.issuer}
                            </p>
                            {certificate.description && (
                              <p className="text-sm mt-2">{certificate.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={getCategoryColor(certificate.category)}>
                                {certificate.category.replace('_', ' ')}
                              </Badge>
                              <Badge variant="success" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(certificate.issue_date).toLocaleDateString()}
                            </div>
                            {certificate.verified_at && (
                              <p className="text-xs mt-1">
                                Verified {new Date(certificate.verified_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <Card className="text-center">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                This digital portfolio contains verified academic achievements and projects.
                Generated on {new Date().toLocaleDateString()}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Verified by Academic Institution</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;