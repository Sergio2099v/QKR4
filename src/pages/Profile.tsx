import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

const supabaseUrl = 'https://qstvvpebmxeljrtxssed.supabase.co';
const supabaseAnonKey =   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdHZ2cGVibXhlbGpydHhzc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzU2NjIsImV4cCI6MjA2MDU1MTY2Mn0.oSqV-Xodv0xfUOe3RtoIfa8p-0lzQm32SFYC1YrNSmI'; // Clé tronquée ici pour la lisibilité
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
        <p><strong>Nom :</strong> {user.user_metadata?.full_name ?? "Nom non défini"}</p>
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
