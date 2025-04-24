import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const questions = [
  {
    id: 1,
    question: "Quelle est la couleur d'un extincteur à eau pulvérisée ?",
    options: ["Rouge avec étiquette bleue", "Rouge avec étiquette jaune", "Rouge avec étiquette verte", "Entièrement bleu"],
    correctAnswer: "Rouge avec étiquette bleue"
  },
  {
    id: 2,
    question: "Quel type d'extincteur est utilisé pour les feux d'origine électrique ?",
    options: ["Eau pulvérisée", "CO2", "Mousse", "Poudre ordinaire"],
    correctAnswer: "CO2"
  },
  {
    id: 3,
    question: "À quelle fréquence doit-on vérifier les extincteurs ?",
    options: ["Tous les mois", "Tous les 6 mois", "Tous les ans", "Tous les 2 ans"],
    correctAnswer: "Tous les ans"
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  const handleAnswerClick = async (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      const percentage = (score / questions.length) * 100;
      
      // Save quiz result
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('quiz_results').insert({
          user_id: user.id,
          user_email: user.email,
          display_name: user.user_metadata.display_name || user.email,
          score: score + (isCorrect ? 1 : 0),
          total_questions: questions.length,
          percentage: percentage
        });

        if (error) {
          toast.error("Erreur lors de l'enregistrement du résultat");
          console.error('Error saving result:', error);
        }
      }
    }
  };
  
  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };

  const percentage = ((score / questions.length) * 100).toFixed(2);
  
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quiz Karoka</h1>
        
        <Card className="w-full">
          {showScore ? (
            <>
              <CardHeader>
                <CardTitle>Résultat du Quiz</CardTitle>
                <CardDescription>
                  Vous avez obtenu {score} sur {questions.length} points ({percentage}%)
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleRetry}>
                  Réessayer
                </Button>
                <Button onClick={handleBackToHome}>
                  Retour à l'accueil
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Question {currentQuestion + 1}/{questions.length}</CardTitle>
                <CardDescription>
                  {questions[currentQuestion].question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3"
                      onClick={() => handleAnswerClick(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
