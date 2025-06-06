import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Quiz from "./pages/Quiz";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

import { createClient } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const supabaseUrl = 'https://shbfqcdwwdphpcymqfuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYmZxY2R3d2RwaHBjeW1xZnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njg2OTAsImV4cCI6MjA2MTE0NDY5MH0.6NEizGSKtoCHIkppyhCROHDOVbnU-luUpR-QZnaiAFE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(!!session)
    );

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route path="/" element={isAuthenticated ? <Index /> : <Navigate to="/auth" />} />
            <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />
            <Route path="/quiz" element={isAuthenticated ? <Quiz /> : <Navigate to="/auth" />} />
            <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
