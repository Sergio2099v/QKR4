import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';

type IncorrectAnswer = {
  question?: string;
  user_answer?: string;
  correct_answer?: string;
};

type QuizResult = {
  id: string;
  display_name: string;
  user_email: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
  incorrect_answers: IncorrectAnswer[] | null;
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

    const cleanedData = data?.map(item => ({
      ...item,
      incorrect_answers: parseIncorrectAnswers(item.incorrect_answers)
    })) || [];

    setResults(cleanedData);
  };

  const parseIncorrectAnswers = (answers: any): IncorrectAnswer[] => {
    if (!answers) return [];
    
    try {
      if (typeof answers === 'string') {
        return JSON.parse(answers);
      }
      return answers;
    } catch (e) {
      console.error('Error parsing incorrect answers:', e);
      return [];
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}-${seconds}${minutes}${hours}`;
  };

  const generatePDF = (result: QuizResult) => {
    try {
      const doc = new jsPDF();
      const formattedDate = formatDate(result.created_at);

      // Infos générales
      doc.setFontSize(20);
      doc.text('Résultat du Quiz', 20, 20);

      doc.setFontSize(12);
      doc.text(`Nom: ${result.display_name}`, 20, 40);
      doc.text(`Email: ${result.user_email}`, 20, 50);
      doc.text(`Score: ${result.score}/${result.total_questions}`, 20, 60);
      doc.text(`Pourcentage: ${result.percentage}%`, 20, 70);
      doc.text(`Date: ${formattedDate}`, 20, 80);

      // Mauvaises réponses
      if (result.incorrect_answers && result.incorrect_answers.length > 0) {
        doc.setFontSize(16);
        doc.text('Questions mal répondues:', 20, 100);

        const tableData = result.incorrect_answers.map(item => [
          item.question || 'N/A',
          item.user_answer || 'N/A',
          item.correct_answer || 'N/A'
        ]);

        (doc as any).autoTable({
          head: [['Question', 'Votre réponse', 'Bonne réponse']],
          body: tableData,
          startY: 110,
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [255, 0, 0] },
        });
      }

      const filename = `quiz-result-${result.display_name}-${formattedDate}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Historique des Quiz</h1>
          <Button variant="outline" onClick={() => navigate('/')}>Retour</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateurs</TableHead>
              <TableHead>Emails</TableHead>
              <TableHead>Scores</TableHead>
              <TableHead>Pourcentages</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>PDF</TableHead>
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
                <TableCell>{formatDate(result.created_at)}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    onClick={() => generatePDF(result)}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span></span>
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
