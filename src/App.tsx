import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import StyleGuide from "./pages/StyleGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/style-guide" element={<StyleGuide />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;