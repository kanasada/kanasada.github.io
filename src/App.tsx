import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/Loading";
import Desktop from "./pages/Desktop";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isLoading) {
        setIsLoading(false);
      }
    };

    const handleTouch = () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };

    // Auto-progress after loading animation completes (5 seconds)
    const autoProgressTimer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouch);
    
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouch);
      clearTimeout(autoProgressTimer);
    };
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading ? (
          <Loading />
        ) : (
          <HashRouter>
            <Routes>
              <Route path="/" element={<Desktop />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
