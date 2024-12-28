import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TestTube } from "lucide-react";
import { runTests } from "@/utils/test-astro";

export const Footer = () => {
  const { toast } = useToast();

  const handleTestClick = () => {
    const results = runTests();
    console.log("Test Results:", results);
    toast({
      title: "Test Results",
      description: `Sun: ${results.signs.sun}, Moon: ${results.signs.moon}, Rising: ${results.signs.rising}`,
      className: "bg-[#FDE1D3] border-[#F5E6D3] text-[#403E43]",
    });
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div className="container max-w-7xl mx-auto flex justify-center">
        <Button 
          onClick={handleTestClick}
          variant="outline"
          className="gap-2"
        >
          <TestTube className="h-4 w-4" />
          Run Astrological Tests
        </Button>
      </div>
    </footer>
  );
};