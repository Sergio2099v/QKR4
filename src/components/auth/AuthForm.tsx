import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Initialize the Supabase client
const supabaseUrl = 'https://shbfqcdwwdphpcymqfuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYmZxY2R3d2RwaHBjeW1xZnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Njg2OTAsImV4cCI6MjA2MTE0NDY5MH0.6NEizGSKtoCHIkppyhCROHDOVbnU-luUpR-QZnaiAFE';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },

            // ✅ Si tu veux activer la confirmation par email plus tard :
            // 🔓 Supprime le commentaire ci-dessous
            // emailRedirectTo: 'https://ton-domaine.com/confirmation' 
            // (Remplace par l'URL où rediriger après clic sur lien de confirmation)
          },
        });

        if (error) throw error;

        // 🔽 Message selon le mode activé
        toast({
          title: "Inscription réussie",
          description: 
            // ✅ Avec confirmation email activée :
            // "Un lien de confirmation vous a été envoyé par email."
            
            // ✅ Sans confirmation (actuel) :
            "Bienvenue dans Quiz Karoka!",
        });

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans Quiz Karoka!",
        });

        // Facultatif : Redirection vers dashboard ou quiz
        // window.location.href = "/quiz";
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Inscription' : 'Connexion'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Créez votre compte pour commencer le quiz' 
            : 'Connectez-vous pour continuer votre progression'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Nom d\'affichage"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Chargement...' : (isSignUp ? "S'inscrire" : 'Se connecter')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp 
              ? 'Déjà un compte ? Connectez-vous' 
              : 'Pas de compte ? Inscrivez-vous'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
