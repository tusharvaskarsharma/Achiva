import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Clock, AlertCircle, Building, Calendar, Award, Trophy, Medal, Star, Target, Zap, Globe, GraduationCap, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  user_id: string;
}

interface CertificateReviewDialogProps {
  certificate: Certificate;
  onReviewComplete: () => void;
  children: React.ReactNode;
}

export const CertificateReviewDialog = ({ certificate, onReviewComplete, children }: CertificateReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleVerify = async (verified: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('certificates')
        .update({
          is_verified: verified,
          verified_by: verified ? (await supabase.auth.getUser()).data.user?.id : null,
          verified_at: verified ? new Date().toISOString() : null
        })
        .eq('id', certificate.id);

      if (error) throw error;

      toast({
        title: verified ? "Certificate Verified" : "Verification Removed",
        description: verified 
          ? "The certificate has been successfully verified." 
          : "The certificate verification has been removed.",
      });

      setOpen(false);
      onReviewComplete();
    } catch (error) {
      console.error('Error updating certificate verification:', error);
      toast({
        title: "Error",
        description: "Failed to update certificate verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Review Certificate: {certificate.title}
          </DialogTitle>
          <DialogDescription>
            Review and verify this student certificate submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Certificate Details */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getCategoryColor(certificate.category)}`}
                  >
                    {getCategoryIcon(certificate.category)}
                    {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1).replace('_', ' ')}
                  </Badge>
                  {certificate.is_verified ? (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{certificate.title}</h3>
              </div>
              {certificate.certificate_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Certificate
                  </a>
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span className="font-medium">Issued by:</span>
                <span>{certificate.issuer}</span>
              </div>
              
              {certificate.issue_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Issue Date:</span>
                  <span>{new Date(certificate.issue_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {certificate.description && (
              <p className="text-muted-foreground mt-3">{certificate.description}</p>
            )}
            
            {certificate.image_url && (
              <div className="mt-3">
                <img 
                  src={certificate.image_url} 
                  alt={certificate.title}
                  className="w-full max-h-48 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-3">
              Submitted on {new Date(certificate.created_at).toLocaleDateString()}
            </p>
            
            {certificate.verified_at && (
              <p className="text-xs text-muted-foreground">
                Previously verified on {new Date(certificate.verified_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Review Comments */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Review Notes (Optional)
            </label>
            <Textarea
              placeholder="Add any notes about this certificate verification..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {certificate.is_verified && (
            <Button
              variant="destructive"
              onClick={() => handleVerify(false)}
              disabled={loading}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Remove Verification
            </Button>
          )}
          <Button
            onClick={() => handleVerify(true)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {certificate.is_verified ? "Update Verification" : "Verify Certificate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};