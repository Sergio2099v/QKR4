import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

type QuizResult = {
  id: string;
  display_name: string;
  user_email: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
};

export default function History() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    setResults(data || []);
  };

  const generatePDF = (result: QuizResult) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Résultat du Quiz', 20, 20);
    
    // Add content
    doc.setFontSize(12);
    doc.text(`Nom: ${result.display_name}`, 20, 40);
    doc.text(`Email: ${result.user_email}`, 20, 50);
    doc.text(`Score: ${result.score}/${result.total_questions}`, 20, 60);
    doc.text(`Pourcentage: ${result.percentage}%`, 20, 70);
    doc.text(`Date: ${new Date(result.created_at).toLocaleString()}`, 20, 80);
    
    // Set filename and download attribute to ensure download behavior
    const filename = `quiz-result-${result.display_name}-${new Date().toISOString()}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Historique des Quiz</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Retour
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Pourcentage</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="flex items-center gap-2">
                  <UserAvatar name={result.display_name} />
                  <span>{result.display_name}</span>
                </TableCell>
                <TableCell>{result.user_email}</TableCell>
                <TableCell>{result.score}/{result.total_questions}</TableCell>
                <TableCell>{result.percentage}%</TableCell>
                <TableCell>
                  {new Date(result.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    onClick={() => generatePDF(result)}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span>Télécharger PDF</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
