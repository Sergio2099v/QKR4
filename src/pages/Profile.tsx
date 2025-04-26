import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const supabaseUrl = 'https://shbfqcdwwdphpcymqfuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYmZxY2R3d2RwaHBjeW1xZnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njg2OTAsImV4cCI6MjA2MTE0NDY5MH0.6NEizGSKtoCHIkppyhCROHDOVbnU-luUpR-QZnaiAFE';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erreur de récupération de l'utilisateur :", error.message);
      }
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!user) {
    return <div className="p-6">Utilisateur non connecté.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      <div className="bg-muted p-4 rounded-lg mb-4">
     
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Créé le :</strong> {new Date(user.created_at).toLocaleString()}</p>
      </div>

      <Button variant="ghost" onClick={handleLogout}>
        Déconnexion
      </Button>
    </div>
  );
};

export default Profile;
