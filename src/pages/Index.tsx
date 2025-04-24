
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserAvatar } from "@/components/UserAvatar";

export default function Index() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    checkIfAdmin();
    getUserInfo();
  }, []);

  const checkIfAdmin = async () => {
    const { data: adminCheck } = await supabase
      .from('users_admin')
      .select('email')
      .single();
    setIsAdmin(!!adminCheck);
  };

  const getUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('email', user.email)
        .single();
      
      if (userData) {
        setUserDisplayName(userData.name);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quiz Karoka</h1>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button variant="outline" onClick={handleViewHistory}>
                Historique
              </Button>
            )}
            <div className="flex items-center gap-3">
              {userDisplayName && <UserAvatar name={userDisplayName} />}
              <Button variant="outline" onClick={handleSignOut}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Bienvenue dans Quiz Karoka !
          </h2>
          <p className="text-muted-foreground">
            Testez vos connaissances sur la réglementation des extincteurs.
          </p>
          <Button size="lg" className="mt-4" onClick={handleStartQuiz}>
            Commencer le Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
