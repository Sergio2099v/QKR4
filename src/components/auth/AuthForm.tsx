import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

// Initialize the Supabase client
const supabaseUrl = 'https://qstvvpebmxeljrtxssed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdHZ2cGVibXhlbGpydHhzc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NzU2NjIsImV4cCI6MjA2MDU1MTY2Mn0.oSqV-Xodv0xfUOe3RtoIfa8p-0lzQm32SFYC1YrNSmI';

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
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              display_name: displayName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast({
          title: "Vérifiez votre email",
          description: "Un lien de confirmation vous a été envoyé.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        if (error) throw error;
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans Quiz Karoka!",
        });
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
                placeholder="Nom d'affichage"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={isSignUp}
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
            {loading ? 'Chargement...' : (isSignUp ? 'S\'inscrire' : 'Se connecter')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp 
              ? 'Déjà un compte? Connectez-vous' 
              : 'Pas de compte? Inscrivez-vous'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
