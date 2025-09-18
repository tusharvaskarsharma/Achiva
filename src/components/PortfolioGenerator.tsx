import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Share2, ExternalLink, Eye, FileText, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const PortfolioGenerator = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePortfolioLink = () => {
    if (!user) return;
    return `${window.location.origin}/portfolio/${user.id}`;
  };

  const handleShareLink = async () => {
    const portfolioUrl = generatePortfolioLink();
    if (!portfolioUrl) return;

    try {
      await navigator.clipboard.writeText(portfolioUrl);
      toast.success("Portfolio link copied to clipboard!");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Failed to copy link");
    }
  };

  const handleViewPortfolio = () => {
    const portfolioUrl = generatePortfolioLink();
    if (portfolioUrl) {
      window.open(portfolioUrl, '_blank');
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Open the portfolio page and trigger print
      const portfolioUrl = generatePortfolioLink();
      if (portfolioUrl) {
        const newWindow = window.open(portfolioUrl, '_blank');
        if (newWindow) {
          // Wait a moment for the page to load, then trigger print
          setTimeout(() => {
            newWindow.print();
          }, 2000);
        }
        toast.success("Opening portfolio for PDF generation...");
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Digital Portfolio Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Generate a professional digital portfolio showcasing your verified achievements and projects.
        </p>

        <div className="grid gap-3">
          {/* Preview Portfolio */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Preview Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Portfolio Preview</DialogTitle>
                <DialogDescription>
                  Your portfolio will include all verified projects and certificates
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-semibold mb-2">What's included:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Your verified academic projects</li>
                    <li>• Earned certificates and achievements</li>
                    <li>• Skills and technologies</li>
                    <li>• Academic timeline and progress</li>
                    <li>• Verification status and timestamps</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleViewPortfolio} className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Portfolio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Generate Shareable Link */}
          <Button variant="outline" className="w-full justify-start" onClick={handleShareLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Copy Shareable Link
          </Button>

          {/* Download PDF */}
          <Button 
            className="w-full justify-start" 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Download as PDF"}
          </Button>
        </div>

        {/* Features */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Portfolio Features:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Web Format
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                PDF Export
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Shareable
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Share Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
          <strong>Note:</strong> Only verified projects and certificates will appear in your public portfolio.
        </div>
      </CardContent>
    </Card>
  );
};