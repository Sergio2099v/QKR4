import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import React from "react";

const supabase = createClient(
  "https://shbfqcdwwdphpcymqfuk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYmZxY2R3d2RwaHBjeW1xZnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njg2OTAsImV4cCI6MjA2MTE0NDY5MH0.6NEizGSKtoCHIkppyhCROHDOVbnU-luUpR-QZnaiAFE" // remplace si tu as mis ailleurs
);

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="w-full bg-gray-100 shadow-md p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="ghost">Accueil</Button>
        </Link>       
        <Link to="/history">
          <Button variant="ghost">Historiques</Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost">Profil</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
