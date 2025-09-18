import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Building, CheckCircle, Clock, Trophy, Medal, Star, Target, Zap, Globe, GraduationCap, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AddCertificateDialog } from "./AddCertificateDialog";

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  issuer: string;
  issue_date: string | null;
  certificate_url: string | null;
  image_url: string | null;
  category: string;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
}

export const SkillsShowcase = () => {
  const { user, userRole } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sports':
        return <Trophy className="h-5 w-5" />;
      case 'academic':
        return <Medal className="h-5 w-5" />;
      case 'technical':
        return <Zap className="h-5 w-5" />;
      case 'language':
        return <Globe className="h-5 w-5" />;
      case 'leadership':
        return <Star className="h-5 w-5" />;
      case 'volunteer':
        return <Target className="h-5 w-5" />;
      case 'online_courses':
        return <GraduationCap className="h-5 w-5" />;
      case 'internship':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'academic':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'technical':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'language':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'leadership':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'volunteer':
        return 'bg-pink-500/10 text-pink-700 border-pink-200';
      case 'online_courses':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-200';
      case 'internship':
        return 'bg-teal-500/10 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (userRole === 'admin') return null;

  if (loading) {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="hero-gradient p-2 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            Skills & Achievements
          </CardTitle>
          <CardDescription>Loading your certificates and achievements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="hero-gradient p-2 rounded-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              Skills & Achievements
            </CardTitle>
            <CardDescription>
              Showcase your certificates, awards, and special skills beyond academics
            </CardDescription>
          </div>
          <AddCertificateDialog onCertificateAdded={fetchCertificates} />
        </div>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No certificates added yet</p>
            <p className="text-muted-foreground text-sm">
              Add your sports achievements, language certificates, leadership awards, and more!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="transition-all duration-200 hover:shadow-md border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${getCategoryColor(certificate.category)}`}
                        >
                          {getCategoryIcon(certificate.category)}
                          {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
                        </Badge>
                        {certificate.is_verified ? (
                          <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    </div>
                    {certificate.certificate_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">Issued by:</span>
                      <span>{certificate.issuer}</span>
                    </div>
                    
                    {certificate.issue_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Date:</span>
                        <span>{new Date(certificate.issue_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {certificate.description && (
                      <p className="text-sm text-muted-foreground">{certificate.description}</p>
                    )}
                    
                    {certificate.image_url && (
                      <div className="mt-3">
                        <img 
                          src={certificate.image_url} 
                          alt={certificate.title}
                          className="w-full h-32 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {certificate.verified_at && (
                      <p className="text-xs text-green-600 font-medium">
                        Verified on {new Date(certificate.verified_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};